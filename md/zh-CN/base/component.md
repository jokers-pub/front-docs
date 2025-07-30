## Joker 组件概述

组件是 Joker 应用的主要构造块。每个组件包括如下部分：

-   一个 HTML 模板，用于声明页面要渲染的内容

-   一个用于定义行为的 TypeScript 类

-   要应用在模板上的 CSS 样式

本主题描述如何创建和配置 Joker 组件。

首先我们要先明确一个理念，一切皆组件，无论是页面还是功能组件，它都是以组件身份存在的，只不过组件的装载时机不同而已。

### 创建一个组件

创建一个后缀名为`.joker`的文件，该文件即是一个组件的 SFC（单文件组件）组件。

组件是由三部分组成的，分别是：

1. `<template>`模板
2. `<script>` 逻辑脚本
3. `<style>` 组件样式

我们来分别介绍这三个部分

### template 模板

在`.joker`文件内创建一个 template 标签（template 需要为一级标签）即代表该标签内为我们的渲染模板，请看下面示例：

```html
<template>
    <div>我是内容</div>
</template>
```

在模板中`@('@')`代表动态指令，Joker 提供了丰富的动态指令。可通过后面的教程[这里](/base/template)来进行学习。

### script 逻辑脚本

在`.joker`文件内创建一个 script 标签（script 需要为一级标签）即代表该标签内为我们的逻辑脚本，请看下面示例：

```html
<script>
    import { Component } from "@joker.front/core";
    export default class extends Component {
        //这里的内容便是我们的组件逻辑
    }
</script>
```

### style 组件样式

在`.joker`文件内创建一个 style 标签 （style 需要为一级标签）即代表该标签内为我们的组件样式，请看下面示例：

```html
<style>
    .div {
        color: #666;
    }
</style>
```

通过 VSCODE 中的`JOKER FRONT TOOLS`扩展，可以快速的去创建一个基础的组件代码，这个扩展提供了默认提供了快速的模板提示，以帮助你更高效地编写 Joker 组件。

![vscode-template](/base/vscode-template.png)
