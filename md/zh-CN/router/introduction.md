## 介绍

Joker Router 是 `Joker` 的官方路由。它主要提供 H5 平台的路由跳转，通过该插件可以快速实现 `SPA`项目的路由搭建。

### 特色

Joker Router 目前支持：

-   多级嵌套路由的配置
-   提供动态路由加载组件`<router-view>`
-   提供路由跳转功能，包括 replace、push、back 等
-   提供路由 keep-alive 状态保持
-   提供 HASH、HTML history 两种模式路由

### 前提条件

在学习和使用`Joker Router`之前，需要们先了解以下基础概念：

-   `SPA(单页应用)`:是一种 Web 应用程序的体系结构,其中所有的交互都在一个页面中完成,而不需要每次加载一个新的页面。
-   [Hash](https://blog.csdn.net/weixin_47002682/article/details/129832436)
-   [HTML history](https://blog.csdn.net/weixin_47002682/article/details/129832436)

### 如何引用

安装 Joker Router

```
pnpm i @joker.front/router
```

引用 Joker Router，并初始化配置。

```ts
import { Router } from "@joker.front/rourter";

new Router({
    routes: [
        { path: "/", redirect: "/a" },
        {
            path: "/a",
            component: a,
            children: [
                { path: "a1", component: a1 },
                { path: "a2", component: a2 }
            ]
        }
    ]
});
```
