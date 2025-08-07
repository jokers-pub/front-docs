## Getting Started  

In this section, we will explore how to use Joker Router in our projects.  

> The following example demonstrates a simple single-level routing case. Nested routing, route state preservation, and other scenarios will be covered in later tutorials. This chapter serves only as an introductory guide.  

### Creating the Entry File/Layout File  

In the **main entry file (`App.joker`)** of the project, configure the `<router-view>` component in the `template` block. This component represents the rendering location for our dynamic components.  

```html  
<template>  
    <h1>Welcome to Joker Router</h1>  
    <div>  
        <p>Below is our component rendering area:</p>  
        <router-view></router-view>  
    </div>  
</template>  
```  

### Creating a Component (Block Page)  

**What is a Block Page?**  
A page can consist of multiple different sections, such as the `header`, `menu`, `content block`, etc. Each block can be a partial page and will be updated on-demand when the route changes.  

![Layout](/router/layout.png)  

For instructions on creating pages, refer to: [Component Overview](/base/component).  

### Initializing and Registering Routes  

```js  
import { Router } from "@joker.front/rourter";  

// Main entry file / Main layout file  
import App from "./app.joker";  

// My block page  
import MyPage from "./my-page.joker";  

new Router({  
    routes: [  
        { path: "/", redirect: "/index" },  
        { path: "/index", component: MyPage }  
    ]  
});  

// Initializing the main entry  
new App().$mount(document.getElementById("app"));  
```  

Joker Router relies on Joker Core, which provides the `<router-view>` routing component.