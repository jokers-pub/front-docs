## Introduction

Joker Router is the official router of `Joker`. It mainly provides route navigation for the H5 platform. With this plugin, you can quickly set up the routing for an `SPA` project.

### Features

Joker Router currently supports:

-   Configuration of multi-level nested routes.
-   A dynamic route-loading component `<router-view>`.
-   Route navigation functions, including `replace`, `push`, `back`, etc.
-   Route `keep-alive` state preservation.
-   Two routing modes: `HASH` and `HTML history`.

### Prerequisites

Before learning and using `Joker Router`, you need to understand the following basic concepts:

-   `SPA (Single-Page Application)`: It is an architecture for web applications where all interactions are completed on a single page without having to load a new page each time.
-   [Hash](https://blog.csdn.net/weixin_47002682/article/details/129832436)
-   [HTML history](https://blog.csdn.net/weixin_47002682/article/details/129832436)

### How to Import

Install Joker Router:

```
pnpm i @joker.front/router
```

Import Joker Router and initialize the configuration:

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

It should be noted that there is a possible typo in the import statement `import { Router } from "@('@')joker.front/rourter";`, it might be `@('@')joker.front/router` instead. And the `a`, `a1`, `a2` here should be properly imported component references in a real-world scenario. For example:

```ts
import { Router } from "@joker.front/router";
import A from "./components/A";
import A1 from "./components/A1";
import A2 from "./components/A2";

new Router({
    routes: [
        { path: "/", redirect: "/a" },
        {
            path: "/a",
            component: A,
            children: [
                { path: "a1", component: A1 },
                { path: "a2", component: A2 }
            ]
        }
    ]
});
```
