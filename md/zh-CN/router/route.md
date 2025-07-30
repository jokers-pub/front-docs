## 路由信息

该章节主要介绍我们如何获取当前的路由信息，路由信息里面包含哪些属性。

### 如何使用

我们可以在 Joker Router 初始化实例，或者`router`中获取**route**对象，该对象即我们当前的路由信息。

```ts
import { router } from "@joker.front/router";

//获取route
router.route;
```

### 如何监听路由变更

值得注意的是，`router.route`对象是一个`ShallowObserver 数据浅代理劫持`对象，对该功能不熟悉的同学，可以去[数据代理](/base/observer)中学习。

由于该对象是一个响应式数据，我们可以通过 [订阅](/base/watcher) 数据变更来判断当前路由的变更。

```ts
new Watcher(
    () => router.route.value,
    () => {
        //路由变更了
    }
);
```

### 属性列表

以下是 `route` 的数据列表：

| 属性名         | 说明                                                                                        | 类型                        |
| -------------- | ------------------------------------------------------------------------------------------- | --------------------------- |
| name           | 命名路由的 name 值                                                                          | string / symbol             |
| path           | 最终访问的地址(对应 router 配置中的 path，区别在于该值不包含动态参数，是被反编译后的字符串) | string                      |
| fullPath       | 完整的访问地址                                                                              | string                      |
| query          | URL Query 参数                                                                              | object                      |
| hash           | 浏览器 hash 值                                                                              | string                      |
| params         | 页面参数                                                                                    | object                      |
| meta           | 路由数据元，用于存储当前路由项的一些静态值                                                  | object                      |
| redirectedFrom | 重定向来源                                                                                  | RouteLocationBase/undefined |
| matched        | 当前地址匹配到的路由记录集合                                                                | RouteRecord[]               |

### matched [匹配路由集合]

为了深入理解`matched`这一概念，我们需要仔细探讨其原理。接下来，我将通过一个具体例子来详细解释`matched`的工作机制。

当我们存在嵌套路由场景时，例如：

```ts
new Router({
    routes: [
        {
            path: "/base",
            component: ChildrenLayout,
            childrens: [
                { path: "page1", component: () => import("./page1.joker") },
                { path: "page2", component: () => import("./page2.joker") }
            ]
        }
    ]
});
```

当我们访问`/base/page1`时， 当前路由的`matched`会包含两条记录，分别是：

```ts
[
    {
        path: "/base"
        //...
    },
    {
        path: "page1"
        //...
    }
];
```

从这个例子可以看出`matched`存放的是当前路由匹配到所有路由项记录，并按照层级按顺序进行记录。
