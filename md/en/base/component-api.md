## Component Methods

Our component development is all based on the powerful library `@('@joker.front/core')`. It provides developers with a series of tools and APIs, including lifecycle hook functions, API functions, and properties, which can help us complete component development more efficiently and conveniently. In this chapter, we will delve into the composition of a component class and let you know how to use this library to create a component with rich functionality and superior performance.

### Prerequisites

Before reading this chapter, you should have a basic understanding of the following:

-   [TypeScript Programming](https://www.typescriptlang.org/)
-   [Joker Lifecycle](/base/component-lifecycle)

The built-in functions provided by Joker Core all start with `$`, such as `this.$watch`, `$destroy`, etc. Next, let's learn about the built-in functions provided by Joker Core:

### Component Mounting (`$mount`)

This function is generally called by the peripheral program to mount the current component.

```ts
import MyComponent from "my-component.joker";

let myComponent = new MyComponent();
myComponent.$mounted(document.getElementById("app"));
```

Let's experience the mounting of a component through the following example.

!!!demo1!!!

| Parameter | Description                                                                      | Type                    | Default Value |
| --------- | -------------------------------------------------------------------------------- | ----------------------- | ------------- |
| root      | The container to be mounted. We often use it to mount a component to a DOM node. | Element/VNode.Component | -             |

> The `root` parameter can be omitted. If it is not passed, the template rendering of the component will not be triggered, and it will only exist as an auxiliary function. We can use this mode to mix in some component functions.

### Component Destruction (`$destroy`)

By actively calling the `$destroy` method of a component instance, the component can be unloaded.

```ts
import MyComponent from "my-component.joker";

let myComponent = new MyComponent();
myComponent.$mounted(document.getElementById("app"));

// Unload
myComponent.$destroy();
```

Let's understand the `destroy` method through the following example.

!!!demo2!!!

For components that have maintained their state, calling the destruction method will not completely destroy the component. The component will maintain its data state in the background. You can pass the parameter `force: true` to completely destroy the component.

Let's see how the destruction method works for components that maintain their state through the following example.

!!!demo3!!!

> A separate chapter later will provide a detailed introduction to maintaining data state.

| Parameter | Description                  | Type    | Default Value |
| --------- | ---------------------------- | ------- | ------------- |
| force     | Whether to force destruction | Boolean | -             |

### Data Observation (`$watch`)

The `$watch` method can be used to observe value changes of hijacked properties and respond with the corresponding function after the value changes.

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
                // The value has changed. The new value is nv, and the old value is ov.
            }
        );
    }
}
```

!!!demo4!!!

> It should be noted that the observed value must be a property hijacked by data (the values in the `model` property will undergo the `observer` operation before the component is mounted). Otherwise, its changes cannot be observed. Please refer to [here](/base/observer) for detailed information on data hijacking.

| Parameter     | Description                                                                                | Type                                                                                                                  | Default Value |
| ------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------- |
| express       | The expression to be observed                                                              | Function                                                                                                              | -             |
| callback      | The callback function after the change                                                     | (nv: any, ov: any) => void. It has two parameters, representing the **new value** and the **old value** respectively. | -             |
| forceCallBack | Whether to force the callback (whether to force the callback when the values are the same) | boolean (optional, default is false)                                                                                  |

### Node Observation (`$watchNode`)

Node observation can be used to monitor changes in virtual nodes, including node removal, addition, and modification.

When learning this method, it is recommended to first understand [What is a VNode](/base/vnode). The virtual node is the bridge between the DOM and the script. It is a virtual node tree that maps the actual DOM tree and is used for data communication between the DOM and the script. Moreover, the VNode can decouple the rendering layer and can be replaced with applet rendering or native mobile rendering (V8 kernel communication). Currently, the `Core` provides the H5-Render by default (H5-DOM rendering, responsible for rendering virtual nodes into H5 tag nodes).

After having a general understanding of virtual nodes, you can continue to learn this API:

```ts
import { Component } from "@joker.front/core";

export default class extends Component {
    model = {
        value: "v1"
    };

    mounted() {
        this.$watchNode("node ref", (node, type, property) => {
            // node: The changed node
            // type: The type of change
            // property: If it is a property change, what is the property name?
        });
    }
}
```

!!!demo5!!!

| Parameter | Description                            | Type                                                                                                                                                                                                                                                     | Default Value |
| --------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| ref       | The ref of the node to be observed     | string                                                                                                                                                                                                                                                   | -             |
| callback  | The callback function after the change | (node: VNode.Node, type: "append" / "remove" / "update" / "after-enter" / "after-leave", property: string) => void. It has three parameters, representing the **changed node**, the **type of change**, and the **changed property value** respectively. | -             |

### Getting Nodes (`$getRef` and `$getRefs`)

By configuring the `ref` attribute for a tag, the tag can be marked. The marked tag can then be retrieved in the script using **$getRef** or **$getRefs**.
This method returns virtual nodes. When learning this method, it is recommended to first understand [What is a VNode](/base/vnode).

```ts
// Get a single node
this.$getRef<VNode.Element>("ref");

// Get multiple nodes
this.$getRefs("ref");
```

`$getRef` will return at most one VNode. If there are multiple nodes with the same ref, only the first one will be returned.

`$getRefs` will return multiple VNodes. It will return all nodes within the current component (excluding child components) with the same ref value.

Both methods support TypeScript generics (default is `VNode.Node`), allowing you to specify the type of the returned node for convenient subsequent value operations.

!!!demo6!!!

| Parameter | Description               | Type   | Default Value |
| --------- | ------------------------- | ------ | ------------- |
| ref       | The ref value of the node | string | -             |

> Of course, we also provide the `$refs` property to store all marked nodes. For detailed knowledge, please refer to the introduction of `$refs` in [Component Properties](/base/component-property).

### Events (`$on`, `$off`, `$trigger`)

`$on`, `$off`, and `$trigger` are the core methods of the component event mechanism, representing event registration, event destruction, and event triggering respectively.

Among them, **trigger** is used more often, usually for event broadcasting from components to the outside.

Next, let's take a look at how to use events:

```ts
// Event registration
this.$on("event name", (e: VNode.Event, param: any) => {
    // Here, e represents the event processing object, responsible for handling event bus flow and data transfer.
    // param represents the additional parameter of the event.
});

// Event unregistration
this.$off("event name", event function);

// Event triggering. When intercepting and forwarding the event, a third parameter can be passed to maintain the consistency of the event object.
this.$trigger("event name", event parameter, e?: VNode.Event);
```

Case display:

!!!demo7!!!

> When we want to listen to all event triggers of a component, we also provide the `*` wildcard. You can listen to all event processing of the component by using `$on('*', ...)`. This wildcard is only applicable to the `$on` API method call and not applicable to event registration in the `template`.

Let's look at a more complex usage example:

```ts
this.childrenComponent.$on("*", (e: VNode.Event) => {
    if (e.eventName === "click") {
        // TODO:...
        return;
    }

    // Do not process other events and continue to pass them up.
    this.$trigger(e.eventName, e.data, e);
});
```

#### Introduction to `VNode.Event`

`VNode.Event` is the event processing object in the Joker front-end. Whether it is an event actively responded to through JS or a native event trigger, this type will be passed as the first parameter to the `$on` function.

This object has a `data` property, which represents the parameter passed by the event. You can specify the value type through generics for convenient subsequent operations. The default value is `undefined`.

| Property Name   | Description                                                | Type                 |
| --------------- | ---------------------------------------------------------- | -------------------- |
| eventName       | The name of the event                                      | string               |
| event           | The native event object, depending on the running platform | any                  |
| target          | The virtual node that responds to the event                | VNode.Node/undefined |
| data            | The event parameter                                        | <T>: any             |
| preventDefault  | Prevent the default event                                  | function             |
| stopPropagation | Prevent event propagation                                  | function             |

Event registration and triggering for tags or components

Parent component

```html
<template>
    <button @click="handleClick('parameter 1', 'parameter 2')">Button</button>
    <MyComponent @click="handleMyComponentClick('parameter 1', 'parameter 2')">Button</MyComponent>
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
            // This is the parameter value passed by the event.
            e.data;
            // These are the extended parameters of the event.
            param1;
            param2;
        }

        handleClick(e: VNode.Event, param1: string, param2: string) {
            // These are the extended parameters of the event.
            param1;
            param2;
        }
    }
</script>
```

Child component

```html
<template>
    <button @click="handleClick">I'm a button in the child component</button>
</template>
<script>
    import { Component } from "@joker.front/core";

    export default class extends Component {
        handleClick() {
            this.$trigger("click", "I'm the parameter passed by the child component");
        }
    }
</script>
```

Let's experience it with a real example:

!!!demo8!!!

In the above example, we can observe that `e.data`, as a parameter passed by the event, is responsible for carrying cross-component data when the event is passed between components. On the other hand, the parameters passed through the function when registering an event, such as `param1` and `param2` in `handleClick(param1, param2)`, are extended parameters of the event handling function and will not be passed along with the event propagation. They are only used as extended parameters in the event handling function within the current component and will only be passed as extended parameters after `e: VNode.Event` during the event response.

By calling `e.preventDefault()`, the default event can be prevented, which is generally used for the response of native events. If you don't understand `preventDefault`, click [here](https://www.w3school.com.cn/jsref/event_preventdefault.asp) to learn more.

```ts
handleClick(e: VNode.Event) {
    e.preventDefault();
}
```

By calling `e.stopPropagation()`, the event can be prevented from continuing to be passed. If you don't understand `stopPropagation`, click [here](https://www.w3school.com.cn/htmldom/event_stoppropagation.asp) to learn more.

```ts
handleClick(e: VNode.Event) {
    e.stopPropagation();
}
```

Each Joker component provides some basic events by default. You can actively listen to these events to handle special requirement scenarios if necessary.

| Event Name    | Description                                 | Parameters |
| ------------- | ------------------------------------------- | ---------- |
| created       | Triggered before the component is mounted   | -          |
| mounted       | Triggered after the component is mounted    | -          |
| sleeped       | Triggered after the component goes to sleep | -          |
| wakeup        | Triggered after the component is awakened   | -          |
| beforeDestroy | Triggered before the component is destroyed | -          |
| destroy       | Triggered after the component is destroyed  | -          |

> From the above default events, we can find that these events correspond to the lifecycle hooks. Lifecycle hooks are usually used for periodic expansion within the current component, while these periodic events are mainly used to listen to and track the state changes of the component outside the component.

### Property Synchronization (`$syncProp`)

Before learning this method, please first understand the knowledge of `model` and `props` in [Component Properties](/base/component-property).

Since `props` can only be read and not set, when you need to transfer the state internally, you must use `model` to create properties. However, when `props` change, they need to be synchronized to `model`. So, without using the `syncProp` method, the code looks like this:

```ts
import { Component } from "@joker.front/core";

export default class extends Component<{
    money: number;
}> {
    model = {
        money: 0
    };

    created() {
        // Synchronize the value for the first time
        this.model.money = this.props.money;

        // Listen for changes and synchronize them to the model
        this.$watch(
            () => this.props.money,
            (nv) => {
                this.model.money = nv;
            }
        );
    }

    handleClick() {
        // Simulate an internal value change
        this.model.money = 300;
    }
}
```

As you can see, the code to achieve one-way value synchronization is quite complex. So, we provide the `$syncProp` method to help developers quickly achieve one-way data synchronization.

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
        // Simulate an internal value change
        this.model.money = 300;
    }
}
```

This method has multiple overloads to meet the needs of most scenarios:

```ts
/**
 * One-way value synchronization (full parameters)
 * @param propKey The name of the props property to be synchronized
 * @param modelKey The name of the model property to be synchronized to
 * @param convertVal If the value types to be synchronized in props and model are different, you can use this method for conversion.
 */
this.$syncProp(propKey: keyof T, modelKey: string, convertVal?: (val: any) => any);

// Other overloads of this method
this.$syncProp(propKey: keyof T, convertVal?: (val: any) => any);

// For example
// If the property names are different and value conversion is required
this.$syncProp('propsValue','modelValue',(val: string) => { return parseInt(val); });

// If the property names are the same and value conversion is required
this.$syncProp('propsValue',(val: string) => { return parseInt(val); });

// If the property names are the same and the value types are the same
this.$syncProp('propsValue');
```

### Node Animation (`$nodeTransition`) [Advanced API]

In some scenarios, you need to actively start an animation for a node through JS, such as "fade in and fade out". This method can help developers actively start an animation for a node.

```ts
this.$nodeTransition(
    // The node or ref that needs animation
    nodeOrRef: string | VNode.Node,
    // The animation cycle type
    mode: "enter" | "leave",
    // The name of the animation, corresponding to the animation class name
    name?: string,
    // The callback function after the animation ends
    callBack?: Function,
    // The animation type
    type?: "transition" | "animation")
```

Let's look at a simple example. Here, we apply a style animation provided by `@('@joker.front/ui')`:

!!!demo9!!!

### Waiting for the Next Render

The rendering of the Joker front-end is immediate. When a property changes, it will be immediately updated and rendered on the page. However, when using asynchronous components, you need to use the `$nextUpdatedRender` function to listen for whether the component has completed the overall rendering update.

```ts
// 1 Usage 1
this.$nextUpdatedRender(() => {
    // TODO: The update is completed.
});

// 2 Usage 2
await this.$nextUpdatedRender();
// TODO: The update is completed.
```

### Rendering Templates (`$render`) [Advanced API]

In Joker, you can create view templates through the `<template>` tag or the `template` property. Of course, you can also render templates by calling
