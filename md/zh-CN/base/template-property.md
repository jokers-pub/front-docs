## 内置属性

本节将重点介绍模板中内建的一些高效功能属性。这些属性旨在协助开发人员迅速应对常见开发场景，提升开发效率。

### ref（标记）

通过这些属性，您可以给标签打上标记，这样在使用[组件 API](#base/component-api)中的`$getRef`等方法时，就能够快速定位到这些已标记的标签。

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

### keep-alive（保持状态）

通过配置该属性来实现对一个**组件**的状态保留，使其在渲染/销毁切换时可以保留过程状态，该属性一般配合 if 指令一起使用。

通过下面这个例子来了解下：

!!!demo1!!!

该属性一定是作用于**组件**类型标签上的，当然你可以可以参考上述例子，使用虚拟组件来进行包裹，实现保持状态的功能。

既然数据被保留，那我们什么时候会真正的销毁掉该组件的实例呢？接下来我们来介绍下 keep-alive 的销毁机制：

通过学习[组件方法](/base/component-api)中的`$destroy`方法可以知道，只有在该方法的传入参数为`true`时才会被销毁。

我们刚才的例子使用的 if 判断，在条件不成立进行内容销毁时，并未指定为强制销毁，所以它才会支持保持状态的能力。

> 睡眠的节点，只是不存在 DOM 树的挂载关系，但是虚拟节点和组件实例仍然存在。

!!!demo2!!!

:::warning
当我们的上级或自身组件被销毁时，若`isKeepalive`属性为`false`或存在强制销毁的要求，我们将依次向下销毁所有保持状态的组件。
:::

### transition-name/transition-type（动画）

transition-name/transition-type 是 Joker Core 提供的节点动画功能属性，该属性提供`enter`/ `leave`两种状态动画，分别对应组件的挂载和销毁。

先看一个例子，该例子借用 joker.front/ui 组件库中的动画来展示它的工作原理：

!!!demo3!!!

我们有六个 CSS 类，它们分别用于定义进入和离开的过渡效果。每个过渡效果类别（enter 和 leave）各有三个对应的样式类。以下是对应于进入效果的三个样式类：

-   **from** 作为动画开始的起始样式，会在动画开始时被添加到节点。
-   在 from 样式添加完毕后，等待下一帧动画处理完毕后，会添加**active** 样式，并移除**from**样式，移除后立即添加**to**样式。

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

transition-type 属性默认为**transition**，当然我们也可以指定该属性为**animation**，使用 animation 去完成动画。

!!!demo4!!!

> 注意，由于 Joker 的 template 模板是不限制根节点个数的，所以当为组件使用动画属性时，它只会作用于该组件的 **第一级 && 第一个** Element 元素上。

### append-to（变更输出位置）[高阶 API]

在组件开发中，经常需要将组件内的节点内容，例如下拉菜单或弹出窗口，投射到组件外部容器中。当组件需要独立挂载并且脱离原有 DOM 结构时，可以将内容直接注入到 **body** 中，此时可以使用特定的属性来迅速实现这一需求。

```html
<div append-to="body">我是一个div</div>
```

> 这里需要注意的是，我们只是修改了节点的 Render 渲染关系，但是不会影响到 [VNode](/base/vnode) 树结构，虚拟节点树仍然会按照我们组件内的层级关系存在。我们仍然可以使用`$getRef`方法来获取到，并且当我们使用**outside**事件修饰符时，即使它的输出结构已经改变，但是它也会受 [VNode](/base/vnode) 树结构影响。

接下来我们用一个示例来展示下工作原理：

我们通过 append-to 向 body 中输出一个 **absolute** 定位的元素块。

!!!demo5!!!

> append-to 支持两种类型的值，分别是：`VNode.Node` 和 `string`，当为 string 时，会按照**document.querySelector**，去获取目标容器。
