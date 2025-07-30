## Nested Routes

This chapter mainly introduces what nested routes are and what requirements we can fulfill using them.

### What are Nested Routes

In complex projects, we may design a hierarchical structure for our project and conduct in-depth encapsulation of the same blocks. At this time, we need to use nested routes to plan dynamic view containers.

![nested-router](/router/nested-router.png)

In the above example diagram, the part within the orange dotted line represents our dynamic view container ([router-view](/router/router-view)). It can be nested. We can use the outermost container as a component container, or we can load a layout file (layout) and use nested routes to achieve complex scenarios.

### How to Use

Nested routes require us to plan and manage our page layout reasonably. Next, we will learn through a simple example step-by-step.

Our goal is to achieve the following layout structure (the CSS part will not be shown, only the tag structure will be demonstrated).

![nested-router](/router/nested-router.png)

1. First, create a view container in the main layout file (App.joker).

```html
<template>
    <div class="top"></div>
    <div class="container">
        <router-view></router-view>
    </div>
</template>
```

2. Next, we create a secondary layout file. Create a `layout.joker` file to manage the layout of our secondary pages.

```html
<template>
    <div class="aside"></div>
    <div class="content">
        <router-view></router-view>
    </div>
</template>
```

3. Then, corresponding route configuration is required.

```ts
// Main entry layout
import App from "./app.joker";

// Our secondary layout file
import ChildrenLayout from "./layout.joker";

new Router({
    routes: [
        {
            path: "/base",
            component: ChildrenLayout,
            children: [
                { path: "page1", component: () => import("./page1.joker") },
                { path: "page2", component: () => import("./page2.joker") }
            ]
        }
    ]
});

// Initialize the main entry layout
new App().$mount(document.getElementById("app"));
```

It should be noted that when switching between `/base/page1` and `/base/page2`, only the second-level view container will be rendered and updated. The **peripheral components** will not be redrawn and refreshed. The components under the first-level route will not be destroyed until the first-level view container changes.

Of course, the `router-view` and nested routes can support more than two levels. You can plan the nesting depth of your routes in more detail.

### Event Supplement [updated]

Before reading this section, please first understand the `updated` event in the [view container](/router/router-view). This section is a supplementary explanation of this event.

Let's take a look at the parameters of the `updated` event in combination with route nesting:

-   `deep`: The level of the view container, used to represent the current level of the view container, corresponding to the nesting level of our routes.
-   `isLeaf`: Whether it is a leaf node.

We can use these two properties to make some complex judgments. For example:

Since we don't know if there are other view containers embedded under the current view container, but we want to hide the loading after the current view is rendered. Here, we need to judge `isLeaf`. Only when it is a leaf node, we handle hiding the loading. Otherwise, it is handed over to the lower-level for processing.

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
            // Only hide when it is a leaf node, otherwise hand over the loading handling to the lower-level
            if (e.data.isLeaf) {
                hideLoading();
            }
        }
    }
</script>
```
