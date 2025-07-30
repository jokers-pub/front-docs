## Component Registration

This chapter mainly introduces how to register components, including the registration mechanisms for private components and global components.

### Private Component Registration

Configure private components within the current component by configuring the `component` attribute. For the component registration mechanism, refer to [Component Registration](/base/component-register).

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

Component registration supports asynchronous operations. You can use the `() => import('component.joker')` method for asynchronous component references. Asynchronous components will not be loaded with the initialization of the parent component, but will be loaded only when the component needs to be rendered. For example:

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

From the above code and the console output (network), it can be seen that the asynchronous component will be loaded only when it is required to be loaded.

### Global Component Registration (registerGlobalComponent)

The `registerGlobalComponent` function is provided in the Core library to register global components. If a component is registered as a global component, it can be used in all components, avoiding repeated registration.

```ts
import { registerGlobalComponent } from "@joker.front/core";
import MyComponent from "./components/my-component.joker";

// Register a single component
registerGlobalComponent("my-componet", MyComponent);

// Also supports registering multiple components
registerGlobalComponent({
    "my-componet": MyComponent,
    "my-test-component": MyTestComponent,
    "my-async-component": () => import("./components/async-component.joker")
    //...
});
```

Let's look at an example of a global component:

```ts
import { registerGlobalComponent } from "@joker.front/core";

// We register global components in the main.ts (entry) file
registerGlobalComponent({
    DemoRow: DemoRow
});
```

!!!demo3!!!

Global component registration, like private component registration, supports the introduction of asynchronous components. Asynchronous components will not be loaded when the project starts, but will be loaded only before they are rendered.

> We do not restrict the location of using the **registerGlobalComponent** function, but we still recommend using it in the entry file, so that it is clearer and faster to understand which global components a project has.

### Finding Global Components (getGlobalComponent)

The Core also provides the **getGlobalComponent** function to obtain global components. Through this method, we can dynamically determine whether the global component you need exists.

It should be noted that the return type of this method has three types:

-   **undefined** (not found)
-   **ComponentConstructor** (the component class to be initialized)
-   **ImportComponentConstructor** (the asynchronous component loading method)

```ts
getGlobalComponent("my-component");
```

### Built-in Global Component (template)

We internally provide a virtual container node. This node only serves as a container and displays the content within the container. The component itself will not output any elements.
We can use this component to achieve the grouping function. For example:

```html
<template>
    <ul>
        <li>I'm the fixed column 1</li>
        <li>I'm the fixed column 2</li>
        <template ref="test">
            <li>I'm column 3</li>
            <li>I'm column 4</li>
        </template>
    </ul>
</template>
```

!!!demo4!!!

### Built-in Global Component (component)

The built-in `component` is used to render dynamic components.

!!!demo5!!!

You can specify the name of the current component through the `name` method. This value can be the name of a private component within the current component or the name of a global component. At the same time, changes in `name` will trigger the rendering of the component to render a new component.

You can use this component as a dynamic component container. Its parameter passing, event registration, etc. are the same as other components. It should be noted that, except for the **keep-alive**, **name**, **transition-name**, and **ref** attributes, all other attributes will be passed through to the component you actually render. The event handling mechanism is the same. We listen to the `*` event of the rendered component within this component (you can view the $on API) and then broadcast all events upward without handling or intercepting them.

Of course, in addition to using **name** to render dynamic components, we also provide the `loadComponent` API. You can call this method to implement a more complex rendering mechanism.

```ts
import { Component, ComponentContainer } from "@joker.front/core";

export default class extends Component {
    testFunction() {
        // Render the component
        this.$getRef<VNode.Component<ComponentContainer>>("test")?.component.loadComponent("name");
    }
}
```

Since it is a dynamic component and supports maintaining data state (keep-alive), we also provide the `removeCache` API to clear the cache of a rendered component.

```ts
import { Component, ComponentContainer } from "@joker.front/core";

export default class extends Component {
    testFunction() {
        // Render the component
        this.$getRef<VNode.Component<ComponentContainer>>("test")?.component.removeCache("name");
    }
}
```
