## Introduction  

Joker Router is the official routing library for `Joker`. It primarily provides routing navigation capabilities for H5 platforms, enabling rapid implementation of routing architecture for `SPA` projects.

### Features  

Joker Router currently supports:  

- Configuration of multi-level nested routes  
- Dynamic route loading component `<router-view>`  
- Routing navigation features including replace, push, back, etc.  
- Route `keep-alive` state persistence  
- Two routing modes: `HASH` and `HTML5 history`  

### Prerequisites  

Before learning and using `Joker Router`, it is necessary to understand the following basic concepts:  

- `SPA (Single Page Application)`: A web application architecture where all interactions are handled within a single page without reloading a new page.  
- [Hash](https://blog.csdn.net/weixin_47002682/article/details/129832436)  
- [HTML5 history](https://blog.csdn.net/weixin_47002682/article/details/129832436)  

### How to Import  

Install Joker Router:  

```
pnpm i @joker.front/router  
```

Import Joker Router and initialize the configuration:  

```ts
import { Router } from "@joker.front/router";  

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