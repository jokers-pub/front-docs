## Route Information

This chapter mainly introduces how to obtain the current route information and what attributes are included in the route information.

### How to Use

We can obtain the **route** object from the initialized instance of Joker Router or the `router`. This object represents our current route information.

```ts
import { router } from "@joker.front/router";

// Get the route
router.route;
```

### How to Monitor Route Changes

It's worth noting that the `router.route` object is a `ShallowObserver data shallow proxy hijacking` object. If you're not familiar with this feature, you can learn about it in [Data Proxy](/base/observer).

Since this object is reactive data, we can determine the current route change by [subscribing](/base/watcher) to the data change.

```ts
new Watcher(
    () => router.route.value,
    () => {
        // The route has changed
    }
);
```

### Attribute List

The following is the data list of `route`:

| Attribute Name | Description                                                                                                                                                                            | Type                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| name           | The `name` value of the named route                                                                                                                                                    | string / symbol             |
| path           | The final accessed address (corresponding to the `path` in the router configuration. The difference is that this value does not contain dynamic parameters and is a decompiled string) | string                      |
| fullPath       | The complete accessed address                                                                                                                                                          | string                      |
| query          | URL Query parameters                                                                                                                                                                   | object                      |
| hash           | The browser hash value                                                                                                                                                                 | string                      |
| params         | Page parameters                                                                                                                                                                        | object                      |
| meta           | Route data metadata, used to store some static values of the current route entry                                                                                                       | object                      |
| redirectedFrom | The source of the redirection                                                                                                                                                          | RouteLocationBase/undefined |
| matched        | The collection of route records matched by the current address                                                                                                                         | RouteRecord[]               |

### matched [Matched Route Collection]

To understand the concept of `matched` in-depth, we need to explore its principle carefully. Next, I'll explain the working mechanism of `matched` in detail through a specific example.

When we have a nested route scenario, for example:

```ts
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
```

When we access `/base/page1`, the `matched` of the current route will contain two records, which are:

```ts
[
    {
        path: "/base"
        //...
    },
    {
        path: "page1"
        //...
    }
];
```

From this example, we can see that `matched` stores all the route entry records matched by the current route and records them in order according to the hierarchy.
