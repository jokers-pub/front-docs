## Component Registration

This section introduces how to register components, including the registration mechanisms for both private and global components.

### Private Component Registration

Configure private components within the current component via the `component` property. For detailed registration mechanisms, refer to [Component Registration](/base/component-register).

```html
<template>
    <MyComponent />
    <MyAsyncComponent />
</template>
<script>
    import { Component } from "@joker.front/core";
    import MyComponent from "./children.joker";
    export default class extends Component {
        component = {
            MyComponent,
            MyAsyncComponent: () => import("./async-children.joker")
        };
    }
</script>
```

!!!demo1!!!

Component registration supports asynchronous loading. You can use `()=>import('component.joker')` for asynchronous component references. Asynchronously loaded components will not be loaded during the parent component's initialization but only when the component needs to be rendered. For example:

```html
<template>
    @if(false){
    <MyAsyncComponent />
    }
</template>
<script>
    import { Component } from "@joker.front/core";

    export default class extends Component {
        component = {
            MyAsyncComponent: () => import("./async-children.joker")
        };
    }
</script>
```

!!!demo2!!!

You can verify from the above code and console output (network) that the async component loads only when required.

### Global Component Registration (registerGlobalComponent)

The Core library provides the `registerGlobalComponent` function for registering global components. Once registered, these components can be used across all components without repeated registrations.

```ts
import { registerGlobalComponent } from "@joker.front/core";
import MyComponent from "./components/my-component.joker";

// Single component registration
registerGlobalComponent("my-componet", MyComponent);

// Supports batch registration
registerGlobalComponent({
    "my-componet": MyComponent,
    "my-test-component": MyTestComponent,
    "my-async-component": () => import("./components/async-component.joker")
    //...
});
```

Example of global component usage:

```ts
import { registerGlobalComponent } from "@joker.front/core";

// Register global components in main.ts (entry file)
registerGlobalComponent({
    DemoRow: DemoRow
});
```

!!!demo3!!!

Like private components, global component registration also supports asynchronous component imports. Async components won't load during application startup but only when they are required for rendering.

> While the **registerGlobalComponent** function can be used anywhere, we recommend using it in the entry file for better clarity and maintainability.

### Retrieving Global Components (getGlobalComponent)

The Core library provides the **getGlobalComponent** function to dynamically check and retrieve registered global components.

Note that the return type can be one of three possibilities:

- **undefined** (not found)
- **ComponentConstructor** (component class awaiting initialization)
- **ImportComponentConstructor** (async component loader function)

```ts
getGlobalComponent("my-component");
```

### Built-in Global Components (template)

We provide a virtual container node that acts purely as a wrapper to display nested content without rendering any element (Element) itself. This component can be used for grouping purposes. Example:

```html
<template>
    <ul>
        <li>Fixed Column 1</li>
        <li>Fixed Column 2</li>
        <template ref="test">
            <li>Column 3</li>
            <li>Column 4</li>
        </template>
    </ul>
</template>
```

!!!demo4!!!

### Built-in Global Component (dynamic component)

The built-in `<component>` is used for rendering dynamic components.

!!!demo5!!!

You can specify a component to render via its `name`, which can refer to either a private component or a global component. Changing the name will trigger a re-render with the new component.

Use it as a dynamic component container. It handles props and events like regular components. Note that apart from **keep-alive**, **name**, **transition-name**, and **ref**, all other attributes are passed through to the actual rendered component. Event handling works similarly—we listen for `*` events on the rendered component (see `$on` API) and propagate them upwards without processing or intercepting.

For advanced dynamic rendering scenarios, we also provide the `loadComponent` API:

```ts
import { Component, ComponentContainer } from "@joker.front/core";

export default class extends Component {
    testFunction() {
        // Render component dynamically
        this.$getRef<VNode.Component<ComponentContainer>>("test")?.component.loadComponent("name");
    }
}
```

As it is inherently a dynamic component with state preservation (keep-alive), we also provide the `removeCache` API to clear cached data for previously rendered components.

```ts
import { Component, ComponentContainer } from "@joker.front/core";

export default class extends Component {
    testFunction() {
        // Clear component cache
        this.$getRef<VNode.Component<ComponentContainer>>("test")?.component.removeCache("name");
    }
}
```
