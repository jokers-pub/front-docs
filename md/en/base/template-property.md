## Built-in Attributes

This section will focus on some highly efficient built-in functional attributes in the template. These attributes are designed to assist developers in quickly handling common development scenarios and improving development efficiency.

### ref (Marker)

With these attributes, you can mark tags. Then, when using methods like `$getRef` in the [Component API](#base/component-api), you can quickly locate these marked tags.

```html
<template>
    <div ref="myDiv"></div>
</template>
<script>
    import { Component } from "@joker.front/core";
    export default class extends Component {
        test() {
            this.$getRef("myDiv");
        }
    }
</script>
```

### keep-alive (State Retention)

Configure this property to retain the state of a **component**, allowing it to preserve its state during the rendering/destruction switch. This property is generally used in conjunction with the `if` directive.

Let's understand this through the following example:

!!!demo1!!!

This property must act on **component-type** tags. Of course, you can also refer to the above example and use a virtual component to wrap it to achieve the function of state retention.

Since the data is retained, when will the component instance be truly destroyed? Next, let's introduce the destruction mechanism of `keep-alive`:

By learning the `$destroy` method in [Component Methods](/base/component-api), we know that it will only be destroyed when the parameter passed to this method is `true`.

In the `if` judgment in our previous example, when the condition is not met and the content is destroyed, it is not specified as a forced destruction. Therefore, it supports the ability to retain the state.

> The sleeping nodes only do not have a DOM tree mounting relationship, but the virtual nodes and component instances still exist.

!!!demo2!!!

:::warning
When the parent component or the component itself is destroyed, if the `isKeepalive` property is `false` or there is a requirement for forced destruction, we will destroy all components that retain the state in sequence from top to bottom.
:::

### transition-name/transition-type (Animation)

`transition-name`/`transition-type` are node animation functional attributes provided by Joker Core. This attribute provides two types of state animations, `enter` and `leave`, corresponding to the mounting and destruction of components respectively.

Let's first look at an example. This example uses the animations in the `joker.front/ui` component library to demonstrate its working principle:

!!!demo3!!!

We have six CSS classes, which are used to define the enter and leave transition effects. Each transition effect category (`enter` and `leave`) has three corresponding style classes. The following are the three style classes corresponding to the enter effect:

-   **from** serves as the starting style of the animation start and will be added to the node when the animation starts.
-   After the `from` style is added, after waiting for the next-frame animation processing to be completed, the **active** style will be added, the **from** style will be removed, and the **to** style will be added immediately after the removal.

![transition-name](/base/transition-name.png)

```scss
.jk-fade-in-enter-active,
.jk-fade-in-leave-active {
    transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}
.jk-fade-in-enter-from,
.jk-fade-in-leave-to {
    opacity: 0;
}
```

The `transition-type` property is `transition` by default. Of course, we can also specify this property as `animation` to complete the animation using `animation`.

!!!demo4!!!

> Note that since the Joker template does not limit the number of root nodes, when using the animation property for a component, it will only act on the **first-level && first** Element element of the component.

### append-to (Change Output Location) [High-order API]

In component development, it is often necessary to project the node content within a component, such as a dropdown menu or a pop-up window, into a container outside the component. When a component needs to be independently mounted and detached from the original DOM structure, the content can be directly injected into the **body**. At this time, a specific property can be used to quickly achieve this requirement.

```html
<div append-to="body">I'm a div</div>
```

> Here, it should be noted that we only modify the Render rendering relationship of the node, but it will not affect the [VNode](/base/vnode) tree structure. The virtual node tree will still exist according to the hierarchical relationship within our component. We can still use the `$getRef` method to obtain it, and when we use the **outside** event modifier, even if its output structure has changed, it will still be affected by the [VNode](/base/vnode) tree structure.

Next, let's use an example to show the working principle:

We use `append-to` to output an **absolute**-positioned element block to the body.

!!!demo5!!!

> `append-to` supports two types of values, namely: `VNode.Node` and `string`. When it is a `string`, it will obtain the target container according to **document.querySelector**.
