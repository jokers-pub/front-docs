## Initializing the Router

This chapter mainly introduces how to initialize `Joker Router` and explains the configurable parameters available during initialization.

### Initialization

`Joker Router` provides the **Router** class for router initialization.

```ts
import { Router } from "@joker.front/rourter";

new Router({
    history: new WebHashHistory(),
    base: "",
    scrollBehavior: (to, from, savePosition) => {
        // Custom scroll behavior after route navigation
    },
    loggerLeve:"warn"
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});
```

### history [History Mode]

The `history` property allows customizing the history mode for routing. Currently, it supports both `HTML history` and `Hash history` modes, with `Hash` mode being the default for managing route history.

```ts
import { WebHistory, WebHashHistory } from "@joker.front/rourter";

new Router({
    history: new WebHashHistory(),

    // Or
    history: new WebHistory()
});
```

Detailed information about `HTML history` and `Hash history` modes can be found in the [History Mode](/router/history) section.

### base [Route Root]

This property allows adding a root path for all configured routes. By default, `base` is empty.

For example, when defining a `/index` route:

```ts
new Router({
    routes: [{ path: "/index", component: MyPage }]
});
```

Without configuring the `base` property, this route can be accessed via `#/index`.

```ts
new Router({
    base:"demo"
    routes: [{ path: "/index", component: MyPage }]
});
```

When the `base` property is set to **demo**, the route becomes accessible via `#/demo/index`.

The `base` configuration applies to all registered routes by prepending the root path.

### scrollBehavior [Scroll Behavior]

The `scrollBehavior` property allows defining custom scroll behavior after route navigation. This method-type property provides access to `source route`, `target route`, and `previously saved scroll position`.

Custom scroll behavior can be implemented like this:

```ts
new Router({
    scrollBehavior() {
        window.scrollTo(0, 0);
    }
});
```

Detailed parameter types and usage can be found in the [Scroll Behavior](/router/scroll) section.

### loggerLeve [Logging Level]

The `loggerLeve` property configures the logging level for Joker Router output.

```ts
new Router({
    loggerLeve: "info"
});
```

Different levels enable scenarios like `debugging` or `production silent mode`. The default logging level is `warn`, where only warnings and errors are output.

The level hierarchy is as follows:

`silent < error < warn < info`

| Value   | Description                                          |
| ------- | ---------------------------------------------------- |
| silent  | Silent mode - no log output                          |
| error   | Only error logs                                      |
| warn    | Error and warning logs                               |
| info    | Full logs - typically used for internal Joker Router debugging |

### routes [Route Registration Configuration]

The `routes` property is arguably the most important when working with Joker Router, as it registers all known (static) route information for your project.

This property also provides clear visibility of all route paths and configurations in the project.

```ts
new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});
```

The `routes` configuration offers extensive flexibility. You can learn more in the [Route Registration](/router/registry) section.