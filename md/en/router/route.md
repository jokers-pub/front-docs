## Routing Information

This section primarily introduces how we obtain current routing information and the attributes contained within the routing information.

### How to Use

We can retrieve the **route** object either during Joker Router initialization or via the `router` instance. This object represents our current routing information.

```ts
import { router } from "@joker.front/router";

// Get the route object
router.route;
```

### How to Monitor Route Changes

It’s important to note that the `router.route` object is a **Shallow Observer data shallow proxy** object. If you're unfamiliar with this feature, you can learn more in the [Data Proxy](/base/observer) section.  

Since this object is reactive, we can detect route changes by [subscribing](/base/watcher) to data updates.

```ts
new Watcher(
    () => router.route.value,
    () => {
        // Route changed
    }
);
```

### Attribute List

Below is the data structure of the `route` object:

| Attribute       | Description                                                                                                  | Type                        |
| --------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------- |
| name            | The `name` value of a named route                                                                           | string / symbol             |
| path            | The final accessed path (corresponding to the `path` in router configuration, excluding dynamic parameters) | string                      |
| fullPath        | The complete accessed path                                                                                  | string                      |
| query           | URL query parameters                                                                                        | object                      |
| hash            | Browser hash value                                                                                          | string                      |
| params          | Page parameters                                                                                             | object                      |
| meta            | Route metadata, used to store static values associated with the current route                               | object                      |
| redirectedFrom  | Redirect source                                                                                             | RouteLocationBase/undefined |
| matched         | The collection of matched route records for the current path                                                | RouteRecord[]               |

### matched [Matched Route Collection]

To fully understand the `matched` concept, let’s delve into its underlying principles. The following example will explain how `matched` works in detail.  

Consider a scenario with nested routes:

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

When accessing `/base/page1`, the `matched` array of the current route will contain two entries:

```ts
[
    {
        path: "/base"
        // ...
    },
    {
        path: "page1"
        // ...
    }
];
```

This example demonstrates that `matched` stores all matched route records in hierarchical order.