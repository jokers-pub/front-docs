## Route State Preservation [keepalive]

This chapter mainly introduces what route state preservation is and how to use it.

### What is Route State Preservation

When developing single-page applications (SPAs), we often encounter situations where users switch from a list page to a detail page. When returning to the list page, we hope to maintain the list's query conditions, pagination status, and other interactive features, avoiding re-rendering the entire list page. At this time, we need to preserve the route state of a certain page so that it is not completely destroyed when navigating away.

### How to Use

We can configure the `keepalive` item of the route entry when registering the route. Setting this property to `true`/`'once'` can achieve route state preservation. Different configuration types have different meanings (**default is undefined**):

- `true`: The component remains alive all the time. It can be destroyed and refreshed by using the **refresh** property when [navigating](/router/change).

- `'once'`: It means the component only lives once. The component will only be rendered from the cache once. The second time it is rendered, it will be executed as a new component. This is generally suitable for route nodes with `high-frequency access + low-frequency updates`.

- `false/undefined`: It means no state preservation is done.

```ts
new Router({
    routes: [
        {
            path: "/product/index",
            component: IndexComponent,
            keepalive: true
        }
    ]
});
```

### How to Clear the State

When we need to refresh a page with preserved state, we can use **refresh:true** in the `push` method to refresh the cache state of the target route.

```ts
push({
    path: "#product/list",
    refresh: true
});
```

> Of course, instead of clearing the cache, you can use the two [lifecycle functions](/base/component-lifecycle) `sleeped` and `wakeup` to achieve data refresh operations within the component. Using `refresh` can destroy and recreate the cached component instance.

### Scenarios for Using `once`

First, when we configure `keepalive` to be **once**, the page will only be cached once. We can use `once` to achieve efficient and simple state-preservation functions in the following scenarios:

1. If the page is a high-frequency access / low-frequency update page, we can use `once` to reduce the number of page renderings.
2. If the next-level route can only return to the current page, that is, the current page chain is single, then we can use `once` to achieve state preservation.

In the single-chain mode, when using `once`, we can avoid using `refresh` during navigation because when we access the page in sequence again, the page no longer has a cached state.

Of course, you can also explore and discover more application scenarios based on this caching strategy.

Some students may wonder why we can't actively clear the cache according to the route-navigation direction. In fact, when the browser handles navigation, it doesn't allow us to obtain the user's interaction history, so we can't determine whether the current navigation is the user going back or going to a new page.

Although we can set a global variable in the `window` object to record each route change, and then judge whether the target address exists in the history record during the next navigation to determine whether it is a backward or forward navigation. However, this method is not advisable because the same address may be both a backward navigation and a new business node. Different pages may navigate to the same address, but the business logic they represent is different. Therefore, we do not recommend managing the route-navigation direction by customizing the history record.

Therefore, when dealing with complex route-navigation scenarios, we recommend using the `refresh` property to decide whether to clear the cache state. This method is more flexible and controllable.
