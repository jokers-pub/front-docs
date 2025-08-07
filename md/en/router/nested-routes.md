## Nested Routing  

This chapter mainly introduces what nested routing is and the requirements it can help us fulfill.  

### What is Nested Routing?  

In complex projects, we may need to design hierarchical structures and perform deep encapsulation for the same sections, which requires us to use nested routing to plan dynamic view containers.  

![nested-router](/router/nested-router.png)  

In the example above, the orange dashed section represents our dynamic view container ([router-view](/router/router-view)), which can be used in a nested manner. We can use the outermost container as a component container or load a layout file to implement complex scenarios using nested routing.  

### How to Use  

Nested routing requires us to plan and manage our page layouts logically. Here, we'll walk through the steps with a simple example.  

Our goal is to implement the following layout structure (CSS will not be displayed; only the HTML structure will be demonstrated).  

![nested-router](/router/nested-router.png)  

1. First, create a view container in the main layout file (`App.joker`).  

```html  
<template>  
    <div class="top"></div>  
    <div class="container">  
        <router-view></router-view>  
    </div>  
</template>  
```  

2. Next, create a second-level layout file. We'll create a `layout.joker` file to manage the layout of our secondary pages.  

```html  
<template>  
    <div class="aside"></div>  
    <div class="content">  
        <router-view></router-view>  
    </div>  
</template>  
```  

3. Now, we need to configure the corresponding routes.  

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
            childrens: [  
                { path: "page1", component: () => import("./page1.joker") },  
                { path: "page2", component: () => import("./page2.joker") }  
            ]  
        }  
    ]  
});  

// Initialize the main entry layout  
new App().$mount(document.getElementById("app"));  
```  

Note that when switching between `/base/page1` and `/base/page2`, only the second-level view container will be re-rendered. **Outer components** will not be refreshed or repainted. The top-level components will only be destroyed or re-rendered when the first-level view container changes.  

Of course, router-view and nested routing are not limited to two levels. You can plan deeper nesting as needed.  

### Event Supplement [updated]  

Before reading this section, please familiarize yourself with the `updated` event in [View Container](/router/router-view). This section provides supplementary explanations for this event.  

Let’s examine the parameters of the `updated` event in the context of nested routing:  

- `deep`: Indicates the hierarchy level of the current view container, corresponding to the nesting level of the route.  
- `isLeaf`: Indicates whether it is a leaf node.  

We can use these properties for complex conditional logic. For example:  

Since we may not know whether the current view container contains nested view containers, but we want to hide the loading spinner after the current view finishes rendering, we can use `isLeaf` to determine this. We'll only hide the loading spinner if it's a leaf node; otherwise, the responsibility is passed to the lower-level container.  

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
            // Only hide loading if it's a leaf node; otherwise, let the lower level handle it  
            if (e.data.isLeaf) {  
                hideLoading();  
            }  
        }  
    }  
</script>  
```