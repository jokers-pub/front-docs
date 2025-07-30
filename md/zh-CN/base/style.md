## Joker 组件样式概述

该章节主要介绍组件 template 的渲染样式，我们可以使用`style`标签来为 template 模板添加样式。

### 概述

其中 style 支持三种样式语言，默认为`css`，除此之外还包括`scss`和`less`两种。我们可以通过配置 style 的**lang**属性来切换我们的样式语言（切换后，Joker Front Tools VSCODE 扩展也会自动切换对应的样式高亮和代码检查机制），接下来我们一切看一下示例：

```html
<style lang="scss">
    div {
        span {
            background: red;
        }
    }
</style>
```

### 样式作用域

除 lange 属性外，style 还提供了`scoped`样式，当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素，和 Shadow DOM 中的样式封装类似。使用时有一些注意事项，不过好处是不需要任何的 polyfill。它的实现方式是通过 PostCSS 将以下内容：

```html
<template>
    <div class="example">你好</div>
</template>
<style scoped>
    .example {
        color: red;
    }
</style>
```

转换为：

```html
<template>
    <div class="example" data-scoped-981d2c8a>你好</div>
</template>
<style>
    .example[data-scoped-981d2c8a] {
        color: red;
    }
</style>
```

使用样式作用域可有效的进行组件之间的样式隔离。

### 样式穿透

使用 scoped 后，父组件的样式将不会渗透到子组件中。不过，子组件的根节点会同时被父组件的作用域样式和子组件的作用域样式影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。

当然在某些特定场景需求我们需要在父节点去改变一个带有 scoped 的子组件样式时，我们可以使用`:deep()`去穿透样式去实现子组件的样式变更，例如：

```html
<style scoped>
    .a :deep(.b) {
        /* ... */
    }
</style>
```

上面的代码会被编译成：

```css
.a[data-scoped-981d2c8a] .b {
    /* ... */
}
```

我们会经常使用样式穿透，来实现对子组件的样式控制，当然也可以在子组件使用样式穿透更改**父容器的区块模板**样式。
