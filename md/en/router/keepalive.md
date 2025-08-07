## Route State Preservation [keepalive]

This chapter introduces what route state preservation is and how to use it.

### What is Route State Preservation

When developing Single Page Applications (SPAs), we often encounter scenarios where users navigate from a list page to a detail page. Upon returning to the list page, we want to maintain the list's query conditions, pagination state, and other interactive features without re-rendering the entire list page. In such cases, we need to enable route state preservation for a specific page to prevent it from being completely destroyed upon leaving.

### How to Use

We can configure the `keepalive` property of a route during registration by setting it to `true` or `'once'` to achieve route state preservation. Different configuration types have the following meanings (**default: undefined**):

- `true`: Always keeps the component alive. The cache can be destroyed and refreshed using the **refresh** property during [navigation](/router/change).

- `'once'`: The component is cached only once. The cached version is rendered the first time, but it will be treated as a fresh component from the second rendering onward. This is typically suitable for routes that are *frequently accessed but infrequently updated*.

- `false/undefined`: No state preservation is applied.

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

When we need to refresh a page with preserved state, we can use the **refresh: true** option in the `push` method to clear the target route's cached state.

```ts
push({
    path: "#product/list",
    refresh: true
});
```

> Alternatively, instead of clearing the cache, you can use the two [lifecycle functions](/base/component-lifecycle) `sleeped` and `wakeup` to implement data refresh operations within the component. Using `refresh` destroys and recreates the cached component instance.

### Use Cases for 'once'

When `keepalive` is set to **once**, the page is cached only once. Here are scenarios where `once` can efficiently implement state preservation:

1. **Frequent access with infrequent updates**: Use `once` to reduce rendering overhead for pages that are frequently visited but rarely updated.  
2. **Single navigation chain**: If the next-level route can only return to the current page (i.e., the navigation chain is linear), `once` can preserve state effectively.  

For such linear navigation patterns, using `once` eliminates the need for manual `refresh` during navigation, as the page no longer exists in the cache upon subsequent visits in the forward direction.

Of course, you can explore and extend this caching strategy for more advanced use cases tailored to your needs.

### Why Not Clear Cache Based on Navigation Direction?

Some may wonder why the cache cannot be cleared dynamically based on the navigation direction. In reality, browsers do not expose user navigation history during routing, making it impossible to determine whether a navigation is a back action or a forward transition to a new page.

Though it is technically possible to track route changes using a global variable on the `window` object to infer navigation direction (e.g., by checking if the target route exists in the history), this approach is **not recommended**. The same route might represent either a backward navigation or a new business node in different contexts. For example, multiple pages could navigate to the same route but carry distinct business logic. Hence, custom history tracking for cache management introduces unnecessary complexity and unpredictability.

For handling intricate routing scenarios, we recommend using the **refresh** property to explicitly control cache clearance, as it offers a more flexible and maintainable solution.