## Parameter Passing

During route navigation, there are many ways to pass parameters. This chapter mainly introduces these parameter-passing methods and their usage scenarios.

### Address Parameter Passing

Depending on the `History mode`, the types of parameters passed in address parameter passing vary. They all include the following ways of passing values:

-   `URL Query`: For example: example.html?param=1&name=zohar.
-   `Path Address Variable Matching`: According to the variable configuration of **path**, it is parsed into parameters at runtime and stored in the current route information.
-   `Router props`: Component parameters can be configured when registering the route, and passed to the page instance when the route is loaded.
-   `Navigation Passing Values (name mode)`: When navigating through methods such as **push**/**replace**, `params` can be passed through the name-based navigation mode.

> In the `HTML History` mode, since route matching is no longer based on **hash**, we can use `Hash` to pass parameters in this mode.

Next, we will introduce the usage and usage scenarios of these value-passing methods respectively.

### URL Query

In the `URL Query` mode, we can use **?** to define page parameters. However, this mode may cause the page to refresh. We generally use this mode in scenarios such as multi-page applications or shared pages.

#### Parameter Passing

Using the link mode:

```html
<a href="/index.html?user=zohar&age=30">DEMO</a>
```

Using the method for navigation:

```ts
push({
    path: "user/info",
    query: {
        user: "zohar",
        age: 30
    }
});
```

#### Parameter Retrieval

We can obtain the Query parameters of the current route through the `window.location.search` property in JS. Of course, we can also obtain the parameters through `router.route.value`, where `router.route` will be introduced in detail in the [Route Information](/router/route) chapter later.

```ts
import { router } from "@joker.front/router";

// Obtain query parameters
router.route.value.query;
```

### Address Variable Matching [path]

Before understanding address variable matching, please first learn the `path` property rules in [Route Registration](/router/registry). This section mainly introduces how to use the **path** rules to pass parameters.

#### Parameter Passing

For example, we configure a path with dynamic parameters:

```ts
new Router({
    routes: [
        {
            path: "/user/:userName/:userAge"
        }
    ]
});
```

#### Parameter Retrieval

When we access the route `#/user/zohar/30`, we can obtain the parameters through `router.route.value`, where `router.route` will be introduced in detail in the [Route Information](/router/route) chapter later.

```ts
import { router } from "@joker.front/router";

// Obtain query parameters
router.route.value.params;

/**
 * =====> Output
 * {
 *     userName: 'zohar',
 *     userAge: '30'
 * }
 */
```

It should be noted that since we are parsing parameters from the address (string), the type of all parameters should be `string`.

### Router props [Component Parameter Passing]

The `Router props` component-parameter-passing method is different from other methods. We pass the parameters to the component to be loaded as `props`.

#### Parameter Passing

```ts
new Router({
    routes: [
        {
            path: "/user/info",
            component: userComponent,
            props: {
                userName: "zohar",
                userAge: 30
            }
        }
    ]
});
```

#### Parameter Retrieval

We can obtain the parameters through props in the component **userComponent** rendered by this route.

```html
<template>
    <ul>
        <li>Name: @props.userName</li>
        <li>Age: @props.userAge</li>
    </ul>
</template>

<script>
    import { Component } from "@joker.front/core";

    export class extends Component<{userName: string, userAge: number}>{
        //...
    }
</script>
```

> This way of passing parameters is not shown in the **URL**, allowing us to handle it as an internal logic parameter. For example, in the following scenario, we have two routes pointing to the same page view component. In this case, we can use `props` to provide different parameters for these two routes, enabling different logical processing in the same view component.

### Navigation Passing Values (name mode)

This mode uses the name-based mode in the router to pass parameters. The principle is basically the same as that of `path` dynamic parameters.

#### Parameter Passing

```ts
new Router({
    routes: [
        {
            name: "userInfo",
            path: "/user/:userName/:userAge"
            //...
        }
    ]
});
```

When we use the push mode for navigation:

```ts
push({
    name: "userInfo",
    params: {
        userName: "zohar",
        userAge: 30
    }
});
```

#### Parameter Retrieval

When we access the route `#/user/zohar/30`, we can obtain the parameters through `router.route.value`, where `router.route` will be introduced in detail in the [Route Information](/router/route) chapter later.

```ts
import { router } from "@joker.front/router";

// Obtain query parameters
router.route.value.params;

/**
 * =====> Output
 * {
 *     userName: 'zohar',
 *     userAge: '30'
 * }
 */
```

It should be noted that when the `path` of a route item has a dynamic parameter configuration and also has a `name` property, Joker Router will try to `reverse-translate` the passed parameters into a `string` according to the `path` configuration in the underlying logic and display it as a new route in the browser address.

If the parameters do not match or there are no dynamic parameters, the navigation will be carried out according to the path after the attempted conversion.

For example:

```ts
new Router({
    routes: [
        {
            name: "userInfo",
            path: "/user/:userName/:userAge?"
            //...
        },
        {
            name: "userInfo2",
            path: "/user"
            //...
        }
    ]
});

push({
    name: "userInfo",
    params: {
        userName: "zohar",
        userAge: 30
    }
});
// The URL will be changed to ==> #/user/zohar/30 after navigation

push({
    name: "userInfo",
    params: {
        userName: "zohar"
    }
});
// The URL will be changed to ==> #/user/zohar after navigation

push({
    name: "userInfo2",
    params: {
        userName: "zohar",
        userAge: 30
    }
});
// The URL will still be ==> #/user after navigation, and the parameters are passed implicitly
```

### meta [Route Data Meta]

We can configure some static values by setting `meta` in the route item.

#### Parameter Passing

```ts
new Router({
    routes: [
        {
            path: "/user/userList",
            meta: {
                env: "dev"
            }
        }
    ]
});
```

#### Parameter Retrieval

We can obtain the parameters through `router.route.value`, where `router.route` will be introduced in detail in the [Route Information](/router/route) chapter later.

```ts
import { router } from "@joker.front/router";

// Obtain query parameters
router.route.value.meta;

/**
 * =====> Output
 * {
 *     env: 'dev'
 * }
 */
```
