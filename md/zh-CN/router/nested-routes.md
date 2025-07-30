## 嵌套路由

本章主要介绍什么是嵌套路由，以及我们可以用嵌套路由实现什么需求。

### 什么是嵌套路由

在复杂的项目中，我们可能会对我们的项目做层级设计规划，对相同区块做深层的封装，这时就需要我们通过嵌套路由来规划动态视图容器。

![nested-router](/router/nested-router.png)

通过上面的示例图，橙色虚线部分即代表我们的动态视图容器([router-view](/router/router-view))，它可以被嵌套使用，我们可以将最外层容器作为一个组件容器使用，也可以再去加载一个布局文件（layout）使用嵌套路由实现复杂的场景。

### 如何使用

嵌套路由需要我们合理的去规划和管理我们的页面布局，接下来我们通过一个简单的示例步骤来进行学习。

我们的目标是实现下面这种布局结构（CSS 部分不做展示，只演示标签结构）。

![nested-router](/router/nested-router.png)

1. 首先在主布局文件中（App.joker）中创建视图容器。

```html
<template>
    <div class="top"></div>
    <div class="container">
        <router-view></router-view>
    </div>
</template>
```

2. 接下来我们创建二级布局文件，我们再创建一个`layout.joker`文件，用于管理我们的二级页面布局。

```html
<template>
    <div class="aside"></div>
    <div class="content">
        <router-view></router-view>
    </div>
</template>
```

3. 接下来需要进行相应的路由配置

```ts
//主入口布局
import App from "./app.joker";

//我们的二级布局文件
import ChildrenLayout from "./layout.joker";

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

//初始化主入口布局
new App().$mount(document.getElementById("app"));
```

值的注意的是，当我们在`/base/page1`和`/base/page2`中切换时，只会渲染更新第二层级的视图容器，**外围组件**不会做重绘刷新。直到第一级视图容器变更时才会销毁掉一级路由下的其他组件。

当然 router-view，嵌套路由不仅仅可以支持 2 级，你可以更深入的去规划你的路由嵌套层数。

### 事件补充 [updated]

阅读该小结前，请先了解下[视图容器](/router/router-view)中的 updated 事件，本小结为该事件的补充说明。

我们结合路由嵌套再来看一下`updated`事件的参数：

-   `deep`：视图容器层级，用于表示当前的视图容器层级，对应我们路由嵌套的层级。
-   `isLeaf`：是否是叶子节点

我们可以使用这两个属性来实现一些复杂的判断，例如：

由于我们不知道当前视图容器下是否还有嵌入其他视图容器，但是我们想在当前视图渲染完成后隐藏 loading，这里就需要判断`isLeaf`，当叶子节点时才处理隐藏 loading，否则交由下层处理。

```html
<template>
    <div class="container">
        <TopBar></TopBar>
        <div class="middle">
            <router-view @updated="routerViewUpdated"></router-view>
        </div>
    </div>
</template>
<script>
    import { Component, VNode } from "@joker.front/core";
    import TopBar from "./common/components/topbar.joker";
    import { hideLoading } from "./common/loading";

    export default class extends Component {
        components = {
            TopBar
        };

        routerViewUpdated(e: VNode.Event<{ isLeaf: boolean }>) {
            //叶子节点时才做隐藏，否则交由下层处理loading
            if (e.data.isLeaf) {
                hideLoading();
            }
        }
    }
</script>
```
