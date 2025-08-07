## Built-in Properties

This section focuses on the efficient built-in properties in templates. These properties are designed to assist developers in quickly addressing common development scenarios and improving productivity.

### ref (Marker)

Using these properties, you can mark tags so that when using methods like `$getRef` from the [Component API](#base/component-api), you can quickly locate these marked tags.

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

### keep-alive (State Preservation)

Configure this property to preserve the state of a **component**, allowing it to retain its state during render/destruction toggles. This property is typically used in conjunction with the `if` directive.

The example below demonstrates its usage:

!!!demo1!!!

This property must be applied to **component-type** tags. Alternatively, you can use a virtual component wrapper, as shown in the example above, to achieve state preservation.

Since data is retained, when will the component instance actually be destroyed? Let’s explore the destruction mechanism of `keep-alive`:

From the [`$destroy` method](/base/component-api) in Component Methods, we know that destruction only occurs when the method's parameter is set to `true`.

In our earlier example using the `if` condition, the content was destroyed under non-matching conditions without forced destruction, which is why state preservation remains active.

> The sleeping node is no longer mounted in the DOM tree, but the virtual node and component instance still exist.

!!!demo2!!!

:::warning
When the parent or current component is destroyed, if the `isKeepalive` property is `false` or forced destruction is specified, all state-preserved child components will be destroyed in sequence.
:::

### transition-name/transition-type (Animations)

`transition-name` and `transition-type` are properties provided by Joker Core for node animation. These properties support `enter`/`leave` state animations corresponding to component mounting and destruction.

First, let's examine an example that uses animations from the `joker.front/ui` component library to demonstrate how it works:

!!!demo3!!!

There are six CSS classes that define the transition effects for entering and leaving. Each transition type (`enter` and `leave`) has three associated style classes. Below are the three style classes for the enter effect:

- **from**: The starting style for the animation, added to the node when the animation begins.
- After the `from` style is applied, the **active** style is added in the next animation frame, and the `from` style is removed. Immediately afterward, the **to** style is applied.

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

The `transition-type` property defaults to **transition**, but you can also set it to **animation** to use CSS animations.

!!!demo4!!!

> Note: Since Joker’s template does not restrict the number of root nodes, when animation properties are applied to a component, they will only affect the **first-level** and **first** Element node of that component.

### append-to (Rendering Location Change) [Advanced API]

In component development, it is often necessary to project node content (e.g., dropdown menus or pop-ups) outside the component container. When a component needs to be independently mounted and detached from its original DOM structure, content can be directly injected into the **body** using this property to quickly fulfill the requirement.

```html
<div append-to="body">I am a div</div>
```

> Note that this only changes the node’s render relationship and does not affect the [VNode](/base/vnode) tree structure. The virtual node tree still follows the component’s hierarchy. You can still use the `$getRef` method to retrieve it, and when using the **outside** event modifier, even if the rendering structure changes, it remains influenced by the [VNode](/base/vnode) tree.

Let’s illustrate how this works with an example:  

We use `append-to` to render an **absolute** positioned element block into the `body`.

!!!demo5!!!

> `append-to` supports two types of values: `VNode.Node` and `string`. When a string is provided, it retrieves the target container via **document.querySelector**.