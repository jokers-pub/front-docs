## Getting Started

Next, we'll learn how to use Joker Router in a project through this section.

> The following example is a simple case of first-level routing. Scenarios such as nested routing and route state preservation will be introduced in detail in subsequent tutorials. This section only serves as an introductory guide.

### Create an Entry File/Layout File

In the `main entry` file **(App.joker)** of the project, we configure the `router-view` component in the `template` block. This component represents the rendering position of our dynamic components in the following.

```html
<template>
    <h1>Welcome to use Joker Router</h1>
    <div>
        <p>Below is the component rendering block:</p>
        <router-view></router-view>
    </div>
</template>
```

### Create a Component (Block Page)

**What is a block page?** A page can consist of multiple different parts, such as the `header`, `menu`, `content block`, etc. Each block can be a partial page and the new page components will be updated on-demand when the route changes.

![Layout](/router/layout.png)

For how to create a page, please refer to [Component Overview](/base/component).

### Initialize the Router and Register Routes

```js
import { Router } from "@joker.front/rourter";

// Main entry file/main layout file
import App from "./app.joker";

// My block page
import MyPage from "./my-page.joker";

new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});

// Initialize the main entry
new App().$mount(document.getElementById("app"));
```

Joker Router depends on Joker Core, which provides the `<router-view>` routing component.
