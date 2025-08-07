## Initializing the Router

This chapter mainly introduces how to initialize `Joker Router` and the relevant parameters that can be configured during initialization.

### Initialization

`Joker Router` provides the **Router** class for initializing the router.

```ts
import { Router } from "@joker.front/rourter";

new Router({
    history: new WebHashHistory(),
    base: "",
    scrollBehavior: (to, from, savePosition) => {
        // Custom operation method for the scrollbar after route navigation
    },
    loggerLeve: "warn",
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});
```

### history [History Mode]

The `history` property allows us to customize the route history mode. Currently, it supports two modes: `HTML history` and `Hash history`. By default, we use the `Hash` mode to manage our route history.

```ts
import { WebHistory, WebHashHistory } from "@joker.front/rourter";

new Router({
    history: new WebHashHistory(),

    // Or
    history: new WebHistory()
});
```

For detailed information about the `HTML history` and `Hash history` modes, please refer to [History Modes](/router/history).

### base [Route Root]

With this property, we can add a root node to all route configurations. By default, `base` is an empty string.

For example, if we define a route address of `/index`:

```ts
new Router({
    routes: [{ path: "/index", component: MyPage }]
});
```

When we don't configure the `base` property, we can access this route page by visiting `#/index`.

```ts
new Router({
    base: "demo",
    routes: [{ path: "/index", component: MyPage }]
});
```

After we configure the `base` property to **demo**, we can access the route by visiting `#/demo/index`.

Once the `base` is configured, it will take effect for all registered routes, and the route root will be added to the beginning of each route.

### scrollBehavior [Scroll Behavior]

The `scrollBehavior` property allows us to handle the scrollbar behavior after route navigation. This property is of function type and provides the `source`, `destination`, and `previously stored scrollbar position of the target route`.

We can use this method to customize the scrollbar behavior:

```ts
new Router({
    scrollBehavior() {
        window.scrollTo(0, 0);
    }
});
```

For detailed parameter types and usage methods, please refer to [Scroll Behavior](/router/scroll).

### loggerLeve [Log Level]

The `loggerLeve` property allows us to configure the route output level of Joker Router.

```ts
new Router({
    loggerLeve: "info"
});
```

By configuring different levels, we can meet requirements such as `debugging` and `silence in production`. The default log level is `warn`, and logs are only output when there are warnings or errors.

The weight of the configured levels is as follows:

`silent < error < warn < info`

| Optional Value | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| silent         | Silent mode, no log output                                             |
| error          | Only output error logs                                                 |
| warn           | Output error and warning logs                                          |
| info           | Output all logs, generally used for internal debugging of Joker Router |

### routes [Route Registration Configuration]

`routes` should be the most important property when using Joker Router. It is responsible for registering all known (static) route information in the current project.

Through this property, you can also clearly view all route page addresses and configuration information in the project.

```ts
new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});
```

The configuration rules for `routes` are very rich. You can learn more about them in the [Register Routes](/router/registry) chapter.
