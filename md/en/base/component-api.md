## Component Methods

Our component development is based on the powerful library `@('@joker.front/core')`. It provides developers with a range of tools and APIs, including lifecycle hooks, API functions, and properties, which help us develop components more efficiently and conveniently. In this chapter, we will delve into the composition of a component class, allowing you to understand how to leverage this library to create feature-rich and high-performance components.

### Prerequisites

Before reading this chapter, you should have a basic understanding of the following:

-   [TypeScript Programming](https://www.typescriptlang.org/)

-   [Joker Lifecycle](/base/component-lifecycle)

The built-in functions provided by Joker Core all start with `$`, such as: `this.$watch`, `$destroy`, etc. Next, let’s explore the built-in functions Joker Core provides:

### Component Mounting ($mount)

This function is typically called by external programs to mount the current component.

```ts
import MyComponent from "my-component.joker";

let myComponent = new MyComponent();
myComponent.$mounted(document.getElementById("app"));
```

Try the example below to experience component mounting.

!!!demo1!!!

| Parameter | Description                                               | Type                     | Default |
| --------- | --------------------------------------------------------- | ------------------------ | ------- |
| root      | The container to mount to, often used to mount a component to a DOM node | Element/VNode.Component | -       |

> The `root` parameter is optional. If no `root` is provided, the component's template will not render, allowing it to exist purely as a functional mixin for additional features.

### Component Destruction ($destroy)

Calling the `$destroy` method of a component instance actively unloads the component.

```ts
import MyComponent from "my-component.joker";

let myComponent = new MyComponent();
myComponent.$mounted(document.getElementById("app"));

// Unload
myComponent.$destroy();
```

Explore `destroy` with the following example:

!!!demo2!!!

For components preserving state, calling the destroy method won't completely destroy the component; it will retain data state in the background. Use the parameter `force:true` to fully destroy it.

See how the destroy method works for state-preserving components:

!!!demo3!!!

> Detailed explanations on data state preservation will be covered in a later chapter.

| Parameter | Description          | Type    | Default |
| --------- | -------------------- | ------- | ------- |
| force     | Whether to force destroy | Boolean | -       |

### Data Observation ($watch)

The `$watch` method observes changes in hijacked properties and triggers corresponding functions when values change.

```ts
import { Component } from "@joker.front/core";

export default class extends Component {
    model = {
        value: "v1"
    };

    mounted() {
        let [val, destroyWatch] = this.$watch(
            () => this.model.value,
            (nv, ov) => {
                // Value changed, new value is nv, old value is ov
            }
        );
    }
}
```

!!!demo4!!!

> Note: The observed value must be a hijacked property (properties within `model` are hijacked via `observer` operations before component mounting). For details on data hijacking, see [here](/base/observer).

| Parameter       | Description                              | Type                                                                 | Default |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------- | ------- |
| express        | The expression to observe                | Function                                                             | -       |
| callback       | Callback function upon change            | `(nv:any, ov:any)=>void` (receives **new value** and **old value**) | -       |
| forceCallBack | Force callback even if value is unchanged | boolean (optional, default `false`)                                  | -       |

### Node Observation ($watchNode)

Node observation tracks virtual node changes, including removal, addition, or updates.

Before using this method, it’s recommended to understand [VNode](/base/vnode). Virtual nodes act as bridges between DOM and Script, mapping the actual DOM tree as a virtual node tree to facilitate communication and decouple the rendering layer (e.g., for mini-programs, native mobile rendering). The `Core` provides `H5-Render` by default (rendering virtual nodes to H5 DOM nodes).

Example:

```ts
import { Component } from "@joker.front/core";

export default class extends Component {
    model = {
        value: "v1"
    };

    mounted() {
        this.$watchNode("node_ref", (node, type, property) => {
            // node: The changed node
            // type: Change type
            // property: The property name if attributes were changed
        });
    }
}
```

!!!demo5!!!

| Parameter  | Description                 | Type                                                                                                                                                                        | Default |
| ---------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| ref       | The ref of the node to observe | string                                                                                                                                                                      | -       |
| callback  | Change callback function    | `(node:VNode.Node, type:"append"/"remove"/"update"/"after-enter"/"after-leave", property:string)=>void` (receives **changed node**, **change type**, and **property value**) | -       |

### Fetching Nodes ($getRef and $getRefs)

Mark elements with the `ref` attribute to fetch them via `$getRef` or `$getRefs`. These methods return virtual Nodes (VNodes).

```ts
// Fetch a single node
this.$getRef<VNode.Element>("ref");

// Fetch multiple nodes
this.$getRefs("ref");
```

`$getRef` returns at most one VNode (the first match if multiple refs exist).  
`$getRefs` returns all nodes with the specified `ref` in the current component (excluding child components).  

Both methods support TypeScript generics (default `VNode.Node`), allowing specific node type returns for easier manipulation.

!!!demo6!!!

| Parameter | Description    | Type   | Default |
| --------- | -------------- | ------ | ------- |
| ref      | Node ref value | string | -       |

> Additionally, the `$refs` property holds all marked nodes (see [`$refs` in Component Properties](/base/component-property)).

### Events ($on / $off / $trigger)

These methods form the core of component event mechanisms:

- `$on`: Registers an event.
- `$off`: Unregisters an event.
- `$trigger`: Triggers an event (commonly used for broadcasting events).

Usage example:

```ts
// Event registration
this.$on("eventName", (e: VNode.Event, param: any) => {
    // e: Event object for handling event flow and data
    // param: Additional event parameters
});

// Event unregistration
this.$off("eventName", callbackFunction);

// Event triggering (optionally pass the event object for forwarding)
this.$trigger("eventName", eventParam, e?: VNode.Event);
```

Example:

!!!demo7!!!

> To monitor all events from a component, use the `*` wildcard (e.g., `$on('*', ...)`). This works only in `$on`, not in template event bindings.

Advanced usage:

```ts
this.childrenComponent.$on("*", (e: VNode.Event) => {
    if (e.eventName === "click") {
        // Handle click
        return;
    }
    
    // Forward other events
    this.$trigger(e.eventName, e.data, e);
});
```

#### VNode.Event Overview

`VNode.Event` is the event handling object in Joker, passed as the first parameter in `$on`. Its `data` property holds event parameters (generics-supported).

| Property         | Description                          | Type                 |
| ---------------- | ------------------------------------ | -------------------- |
| eventName       | Event name                          | string               |
| event           | Native event object (platform-specific) | any                  |
| target          | Target VNode of the event            | VNode.Node / undefined |
| data            | Event parameters                     | `<T>`: any           |
| preventDefault  | Prevents default event behavior       | function             |
| stopPropagation | Stops event propagation               | function             |

### Event Registration and Triggering

Parent Component:

```html
<template>
    <button @click="handleClick('param1', 'param2')">Button</button>
    <MyComponent @click="handleMyComponentClick('param1', 'param2')"></MyComponent>
</template>
<script>
    import { Component, VNode } from "@joker.front/core";
    import { MessageBox } from "@joker.front/ui";
    import MyComponent from "./children1.joker";

    export default class extends Component {
        components = {
            MyComponent
        };
        handleMyComponentClick(e: VNode.Event<string>, param1: string, param2: string) {
            // Event-passed parameter
            e.data;
            // Extended parameters
            param1;
            param2;
        }

        handleClick(e: VNode.Event, param1: string, param2: string) {
            // Extended parameters
            param1;
            param2;
        }
    }
</script>
```

Child Component:

```html
<template>
    <button @click="handleClick">Child Button</button>
</template>
<script>
    import { Component } from "@joker.front/core";

    export default class extends Component {
        handleClick() {
            this.$trigger("click", "Child component parameter");
        }
    }
</script>
```

Live example:

!!!demo8!!!

In the example above, `e.data` carries cross-component data, while parameters like `param1, param2` are local to the event handler.

### Property Synchronization ($syncProp)

Before using this method, familiarize yourself with [`model` and `props`](/base/component-property).

Since `props` are read-only, internal state changes require `model`. To sync `props` to `model`, use `$syncProp`:

```ts
export default class extends Component<{
    money: number;
}> {
    model = {
        money: 0
    };

    created() {
        this.$syncProp("money");
    }

    handleClick() {
        this.model.money = 300; // Internal state change
    }
}
```

Overloads for different scenarios:

```ts
// Full signature
this.$syncProp(propKey: keyof T, modelKey: string, convertVal?: (val: any) => any);

// Shorthand (same property name, type conversion)
this.$syncProp('propsValue', (val:string) => parseInt(val));

// Basic (same property name and type)
this.$syncProp('propsValue');
```

### Node Animation ($nodeTransition) [Advanced]

Trigger node animations (e.g., fade-in/out) programmatically:

```ts
this.$nodeTransition(
    nodeOrRef: string | VNode.Node, // Node/ref to animate
    mode: "enter" | "leave",       // Animation phase
    name?: string,                 // Animation class name
    callBack?: Function,           // Post-animation callback
    type?: "transition" | "animation" // Animation type
);
```

Example (using `@joker.front/ui` animations):

!!!demo9!!!

### Awaiting Next Render ($nextUpdatedRender)

Joker renders changes instantly. For async components, use `$nextUpdatedRender` to wait for completion:

```ts
// Method 1
this.$nextUpdatedRender(() => {
    // Rendering complete
});

// Method 2 (async/await)
await this.$nextUpdatedRender();
```

### Template Rendering ($render) [Advanced]

Dynamically change templates via `$render` (advanced usage):

```ts
/**
 * Render a template
 * @param asts New AST nodes
 * @param keepalive Preserve alive components during re-render (use with caution)
 */
this.$render(asts:AST.Node[] | (()=>AST.Node[]), keepalive?: boolean);
```

For AST details, see [here](/base/ast).

!!!demo10!!!

> Template rendering has its own lifecycle—old templates are destroyed (nodes, data, events) before rendering new ones. See [here](/base/ast).