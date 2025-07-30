## 条件渲染

该章节主要介绍在`template`模板中如何去实现一个逻辑分支。

### if

在模板中使用`@('@if(条件)'){ ... }`，来实现逻辑分支，它被用于条件性地渲染一块内容。这块内容只会在指令的表达式返回真值时才被渲染。`if(条件)`中的条件，可以为一个值、表达式、属性也可以是一个方法调用。

```xml
@if(value){
    <p>我是一条段落</p>
}
```

通过上面的代码示例，可以看到语法上和 javascript 中 if 的使用规则是一样的，只不过 Joker 提供的`if / else if / else`指令都必须使用`{}`来包裹你的内容，大括号是**不可以被省略**的。

!!!demo1!!!

### else if

`else if` 不可独立存在，它一定是随着 `if` 指令一起使用的。在使用 `else if` 时，前面无需加入 `@`。`if` 的开始已经表明了一个指令的开始，`else if` 只是作为一个逻辑的分支语法。

**else if** 和 **if**必须是邻近同级，不可以隔位或跨级进行关联。

```xml
@if(value===1){
    <p>我是段落一</p>
}
else if(value===2){
    <p>我是段落二</p>
}
else if(value===3){
    <p>我是段落三</p>
}
...
```

!!!demo2!!!

> 值的注意的是，if 判断的顺序是从上向下的，若前面的判断为 true 时，即时后面 else if 的条件也为 true，它也不会被渲染（单判断条件会执行，看后文）。

这里需要注意的是，`template`中的 **if**、**else if**，不会像我们传统编码运行机制一样每次从上到下的去执行，虽然我们在内部实现了从上到下的条件运行机制并控制其渲染，但是**if**、**else if**中的判断条件每次都会去运行并尝试去解析结果，所以**约束条件要互相独立而不是关联的**，这样的目的是实现 else if 的`局部条件更新到达极致的响应性能体验`，我们结合一个例子看下：

```xml
@if(array===undefined){
    <p>我是段落一</p>
}
else if(array.length===0){
    <p>我是段落二</p>
}
else {
    <p>我是段落三</p>
}
```

通过上面的例子可以看到，若`array`为 undefined 时，`else if`中的判断条件会报错，因为它无法读取 length 属性，所以正确的写法是：

```xml
@if(array===undefined){
    <p>我是段落一</p>
}
else if(array && array.length===0){
    <p>我是段落二</p>
}
else {
    <p>我是段落三</p>
}
```

### else

`else`关键字可以与`if`形成一对，也可以与`if-else`链中的其他`else if`语句形成一对。当`if`条件不满足时，程序会继续执行`else`后面的代码块。在一个`if-else`链中，只有最后一个`else`（如果没有`else if`语句）可以独立存在，其他`else`必须与`if`或`else if`形成一对。

```xml
@if(value===1){
    <p>我是段落一</p>
}
else if(value===2){
    <p>我是段落二</p>
}
else {
    <p>我是段落三</p>
}
```

!!!demo3!!!

### 深入原理

在条件渲染过程中，只有第一个条件符合的逻辑快才会被渲染，否则渲染`else`逻辑块或者不渲染(没有 else)，当我们需要动态去配置一个组件的展示状态时，他的展示和隐藏其实是一个组件**创建**和**销毁**的操作。

通过下面的一个例子来感受下逻辑块实际的工作原理：

这是子组件的代码

```html
<template>
    <p>我是子组件@props.name</p>
</template>
<script>
    import { Component } from "@joker.front/core";
    import { Message } from "@joker.front/ui";

    export default class extends Component<{
        name: string
    }> {
        mounted() {
            Message({
                message: `${this.props.name}被初始化挂载`,
                type: "success"
            });
        }
        beforeDestroy() {
            Message({
                message: `${this.props.name}被销毁了`,
                type: "warning"
            });
        }
    }
</script>
```

!!!demo4!!!

当然你也可以在 if 中使用`keep-alive` 来实现切换时状态保持的需求。

!!!demo5!!!
