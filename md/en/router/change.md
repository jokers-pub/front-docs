## Route Navigation

This section mainly introduces how to perform route navigation and how to pass route parameters.

### Native Navigation

We can directly achieve route navigation by leveraging the **href** attribute of the `a` tag. Taking the `Hash` mode as an example:

!!!demo1!!!

### RouteLocationRaw [Type]

In addition to the native link-based navigation, we also provide navigation methods such as `push` and `replace`. When navigating via JavaScript methods, a parameter of type `RouteLocationRaw` must be passed as the target information for navigation. Let's first introduce the property specifications of this type.

```ts
type RouteLocationRaw = string | RouteLocationPathRaw | RouteLocationNameRaw;
```

Next, we'll use the `push` method as an example to introduce the usage types of this parameter.

1. string

We can directly set it to a string-based address. In the `hash` mode, the `#` can be omitted.

```ts
push("router/init");
```

2. RouteLocationPathRaw [path Mode]

Navigate in the `path` mode and support various functional configurations.

```ts
push({
    path: "router/init",
    query: {
        role: "manager"
    },
    refresh: true
    //...
});
```

The complete properties of this type:

| Property Name | Description                                                                                    | Type         |
| ------------- | ---------------------------------------------------------------------------------------------- | ------------ |
| path          | Navigation address                                                                             | string       |
| replace       | Whether not to record this route in history                                                    | boolean      |
| force         | Force navigation, generally used for forced refreshing of the same address                     | boolean      |
| refresh       | Refresh the cache. When the page has `keepalive`, the cache can be refreshed via this property | boolean      |
| state         | Route state data                                                                               | HistoryState |
| hash          | Use `hash` for parameter configuration in the `HTML History` mode                              | string       |
| query         | URL Query parameter passing                                                                    | object       |

3. RouteLocationNameRaw [name Mode]

Navigate in the `name` mode and support various functional configurations. For knowledge related to `name`, please refer to the `name` property in [Register Routes](/router/registry).

```ts
push({
    name: "userlist",
    query: {
        role: "manager"
    },
    refresh: true
    //...
});
```

The complete properties of this type:

| Property Name | Description                                                                                    | Type         |
| ------------- | ---------------------------------------------------------------------------------------------- | ------------ |
| name          | Target route name [named route]                                                                | string       |
| params        | Route parameters                                                                               | object       |
| replace       | Whether not to record this route in history                                                    | boolean      |
| force         | Force navigation, generally used for forced refreshing of the same address                     | boolean      |
| refresh       | Refresh the cache. When the page has `keepalive`, the cache can be refreshed via this property | boolean      |
| state         | Route state data                                                                               | HistoryState |
| hash          | Use `hash` for parameter configuration in the `HTML History` mode                              | string       |
| query         | URL Query parameter passing                                                                    | object       |

> It's worth noting that only in the `name` mode is it **allowed** to pass `params`. In the `path` mode, `params` will be used to parse dynamic parameters based on the current **path**.

### push

Navigate to an address. Internally, it calls `history.pushState` to effectively change the URL.

!!!demo2!!!

The `push` method supports one parameter of type `RouteLocationRaw`.

### replace

Similar to the `push` method, it uses `history.replaceState` to change the browser's URL, but it doesn't create a new entry in the history list. Instead, it replaces the current entry. This means that when the user clicks the back button, they won't return to the previous state but directly to the initial state.

!!!demo3!!!

The `replace` method ignores the history of the current address. It supports one parameter of type `RouteLocationRaw`.

### go

A navigation method that supports forward and backward navigation.

```ts
import { router } from "@joker.front/router";

router.go(1);

router.go(-1);
```

It supports an integer-type parameter. A positive number means navigating backward, and a negative number means navigating forward.

### back

Navigate back to the previous level.

```ts
import { router } from "@joker.front/router";

router.back();
```

### forward

Navigate forward, which only takes effect when there is navigation history to return to.

```ts
import { router } from "@joker.front/router";

router.forward();
```
