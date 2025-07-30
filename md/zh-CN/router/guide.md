## 入门

接下来我们将通过该章节来了解下我们在项目中去使用 Joker Router。

> 接下来的例子是一个简单的一级路由的案例，嵌套路由、路由状态保持等场景可在后续教程中详细介绍，本章节只作为入门指引。

### 创建入口文件/布局文件

我们在 `项目的主入口` 文件 **(App.joker)** 中的`template`区块配置`router-view`组件，该组件代表接下来我们的动态组件的渲染位置。

```html
<template>
    <h1>欢迎使用Joker Router</h1>
    <div>
        <p>下面是我们的组件渲染区块：</p>
        <router-view></router-view>
    </div>
</template>
```

### 创建一个组件(区块页面)

**什么是区块页面** 一个页面中可以由多个不同的部分组成，例如：`头部`、`菜单`、`内容区块`等等，每个区块都可以是一个局部页面，并在路由变化时按需去更新新的页面组件。

![Layout](/router/layout.png)

如何创建页面，可参考 [组件概述](/base/component)

### 初始化路由并注册路由

```js
import { Router } from "@joker.front/rourter";

//主入口文件/主布局文件
import App from "./app.joker";

//我的区块页面
import MyPage from "./my-page.joker";

new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});

//初始化主入口
new App().$mount(document.getElementById("app"));
```

Joker Router 依赖于 Joker Core，它提供了`<router-view>`路由组件。
