## Route Registration

This chapter mainly introduces how to register routes and understand the route configuration rules.

Currently, there are two ways to register routes: `configuring route rules during initialization` and `dynamic route registration`.

### Configuring Route Rules during Initialization

We can configure all the known route information of the entire project through `routes` when initializing the router.

```ts
import { Router } from "@joker.front/router";

// My block page
new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});
```

### Dynamic Route Registration

We provide a dynamic route registration method, which allows us to dynamically manage the registration of route matching rules based on differences such as environment variables and dynamic variables.

```ts
let appRouter = new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", name: "parent", component: MyPage }
    ]
});

appRouter.addRoute({ path: "/index", component: MyPage });

// Add child routes to a known route
appRouter.addRoute({ path: "/children", component: MyPage }, "parent");
```

This method supports passing two parameters:

| Parameter Name  | Description                                                                                                                                                                         | Parameter Type                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| route           | The route entry to be added                                                                                                                                                         | `RouteRecordRaw`, the same type as the initialization route configuration entry |
| parentRouteName | The `name` of the parent route node. The parent route needs to be a `named route`. This parameter is **optional**. If not configured, it will be configured as a first-level route. | `RouteRecordName (string/symbol)`                                               |

> It should be noted that dynamic route registration does not allow registering the home page address of a project. When Joker Router is **initialized**, it will load the current address/home page address by default. Therefore, when registering routes through this method, **it is necessary to ensure that the registration is completed before rendering the page**.

### Route Configuration Item [RouteRecordRaw]

The `route configuration item` is a data type that must be understood when registering routes in Joker Router. Whether it is initializing route registration or dynamic route registration, the route information needs to be configured according to the **RouteRecordRaw** type.

The following is the description of the relevant properties of `RouteRecordRaw`:

### path [Matching Rule]

The `path` property is used to configure the route matching rule. The `path` provides a rich set of configuration rules. It can be a static route address, such as `/home/index`, or a dynamic route address, such as `/user/:id`. Let's take a detailed look at the route matching rules.

First, the `path` property is of the `string` type. We can set the route rules by configuring a fixed static address:

```ts
new Router({
    routes: [
        {
            path: "/home/index"
        },
        {
            path: "user/list"
        }
    ]
});
```

In addition, we can also configure dynamic matching rules through expressions:

#### Dynamic Parameters

We can use the `:` method to set our dynamic parameters. The key after **:** represents the name of our dynamic parameter.

```ts
new Router({
    routes: [
        {
            path: "/user/:id"
        }
    ]
});

/**
 * /user/abc   => true
 * /user/123   => true
 * /user       => false
 * /user/a/b   => false
 */
```

After configuring according to the above rules, when we access addresses such as `/user/abc` or `/user/123`, they will be considered to match the current route rule.

After the actual page is loaded, we will pass the content after `/user/` as a parameter to the parameters in [Route Information](/router/route) and name the parameter **id**.

When we access `/user` or `/user/abc/xxx`, this route rule **will not be matched** because the `:` dynamic rule is configured only once and cannot be repeated.

#### Regular Constraints

We allow adding a regular matching rule for the parameter after the `:` dynamic parameter. You can configure the regular rule for the parameter within `()`. For example:

```ts
new Router({
    routes: [
        {
            path: "/user/:id(\\d+)"
        }
    ]
});

/**
 * /user/abc   =>  false
 * /user/123   =>  true
 */
```

#### Dynamic Concatenation

Dynamic parameters can be concatenated with static characters to achieve complex address matching rules. For example:

```ts
new Router({
    routes: [
        {
            path: "/home/:id([0-9]{2})hello"
        }
    ]
});

/**
 * /home/12hello   =>  true
 * /home/123hello  =>  false
 */
```

It should be noted that although the `dynamic + static` concatenation is used in the expression, we will correctly disassemble the parameter variables when converting the address parameters. For example, for `/home/12hello`, the disassembled parameter is **id = '12'**.

#### Optional Parameters

When we need to make a parameter optional, we can add `?` after the variable. **It means the parameter is optional, not a regular expression constraint rule**.

```ts
new Router({
    routes: [
        {
            path: "/user/:id?"
        }
    ]
});

/**
 * /user/abc   => true
 * /user       => true
 * /user/a/b   => false
 */
```

When there are parameters, add **?** after `()`.

```ts
new Router({
    routers: [
        {
            path: "/user/:id(\\d{2})?"
        }
    ]
});

/**
 * /user/12   => true
 * /user      => true
 * /user/1    => false
 * /user/123  => false
 * /user/1/2  => false
 */
```

#### Repeatable

We can add `+`/`*` after the dynamic parameter to indicate that the parameter can be repeated multiple times. Here, `+` means it must be repeated at least once, and `*` means it can be repeated and is optional.

```ts
new Router({
    routes: [
        {
            path: "/user/:id(\\d+)+"
        }
    ]
});

/**
 * /user/1     => true
 * /user/1a    => false
 * /user/1/2/3 => true
 * /user       => false
 * /user/1/b   => false
 */
```

```ts
new Router({
    routes: [
        {
            path: "/user/:id*"
        }
    ]
});

/**
 * /user/abc   => true
 * /user       => true
 * /user/a/b   => true
 */
```

Here is an example of complex static character concatenation:

```ts
new Router({
    routes: [
        {
            path: "/user:id+"
        }
    ]
});

/**
 * /userabc   => true  The parameter is abc
 * /user       => false
 */
```

```ts
new Router({
    routes: [
        {
            path: "/:id(\\d+)+user"
        }
    ]
});

/**
 * /123user   => true  The parameter is 123
 * /123+user  => false '+' is a variable modifier
 */
```

#### Repeatable and Optional [*]

When we configure the `*` modifier, it means the variable is optional and repeatable.

```ts
new Router({
    routes: [
        {
            path: "/user/:id*"
        }
    ]
});

/**
 * /user/abc   => true
 * /user       => true
 * /user/a/b   => true
 */
```

### redirect [Redirection]

We can achieve route redirection by configuring the `redirect` property.

```js
new Router({
    routes: [
        {
            path: "/",
            redirect: "/home/index"
        }
    ]
});
```

The above code means that when there is no address, it will be redirected to `/home/index`.
When configuring **redirect**, in addition to supporting string-type values, it also supports method-based redirection and more configurable route configurations.

More comprehensive configurations:

```ts
new Router({
    routes: [
        {
            path: "/",
            redirect: {
                name: "Named Route",
                params: { value: "1" }
            }
        },
        {
            path: "/",
            redirect: {
                hash: "/home/index",
                query: { value: "1" }
            }
        },
        {
            path: "/",
            redirect: {
                path: "/home/index"
            }
        }
    ]
});
```

Custom method. This method will receive the current route information and needs to return a new route. Please refer to the specification format provided in the **More comprehensive configurations** above for the return type:

```ts
new Router({
    routes: [
        {
            path: "/",
            redirect: (to: RouteLocationBase) => {
                return {
                    name: "Named Route",
                    params: { value: "1" }
                };
            }
        }
    ]
});
```

### name [Named Route]

We can add a `name` property to a route configuration item to name it. After naming, the route can be quickly set through the **name** during operations such as navigation and route addition.

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            name: "home"
        }
    ]
});
```

### alias [Route Matching Alias]

`alias` can be used to supplement the matching address. It can also be understood as an alias for the `path` matching rule. It can be configured as a string or an array of strings. The values follow the `path` type specification.

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            alias: "/home"
        },
        {
            path: "/user/list",
            alias: ["/user", "/u/list", "/user/all"]
        }
    ]
});
```

### meta [Route Metadata]

`meta` is a metadata property of the route, used to store custom data of the route. After configuring the metadata, we can obtain this data in route aspect events and route information for corresponding business operations.

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            meta: {
                param: "v1"
            }
        }
    ]
});
```

How to use it:

```ts
let appRouter = new Router({
    //...
});

appRouter.beforeRouteCallbacks.add((to, from) => {
    if (to.meta.param === "v1") {
        //TODO:
    }
});
```

Or obtain the value through the `router` information within the component. For details, please refer to [Route Information](/router/route).

```ts
import { router } from "@joker.front/router";

if (router.route.value.meta.param === "v1") {
    //TODO:
}
```

### children [Child Routes]

By configuring `children`, we can configure the child route entries of the current route. This is what we usually call `nested routes`.

```ts
new Router({
    routes: [
        {
            path: "/user",
            component: MyComponent,
            children: [
                { path: "list", component: userListComponent },
                { path: "info", component: userInfoComponent }
            ]
        }
    ]
});
```

From the above example, we can see that we have created a `/user` route, and there are two child routes under this route. If their **path** properties do not start with `/`, the child route matching rules will be configured in a concatenated manner (**parent route path/child route path**).

-   /user/list
-   /user/info

When the **path** rule of the child route starts with **/**, the parent route `path` configuration will be ignored. For example:

```ts
new Router({
    routes: [
        {
            path: "/user",
            component: MyComponent,
            children: [
                { path: "/user/list", component: userListComponent },
                { path: "/user/info", component: userInfoComponent }
            ]
        }
    ]
});
```

The above example will also be parsed into the two routes `/user/list` and `/user/info` in the end.

[Nested Routes](/router/nested-routes) will be introduced in detail in a separate chapter later.

### component/components [Route Components]

We can use the `component/components` properties to configure the view components that the current route needs to load. The difference between them is as follows:

-   `component`: The current route only needs to load one component. It can also be understood that there is only one `<router-view>` tag in the layout file.
-   `components`: The current route needs to load multiple components. There are multiple named containers `<router-view>` in the layout file.

For `<router-view>`, you can learn about it by referring to [Dynamic Container](/router/router-view).

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent
        },
        {
            path: "/user/index",
            components: {
                top: userTopComponent,
                bottom: userBottomComponent
            }
        }
    ]
});
```

Of course, `component/components` also support asynchronous lazy-loaded components:

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: () => import("index.joker")
        },
        {
            path: "/user/index",
            components: {
                top: userTopComponent,
                bottom: () => import("./user/bottom.joker")
            }
        }
    ]
});
```

### props [Component Parameters]

The `props` property is generally used to configure parameters for the `component/components` components. The parameters configured in **props** will be passed as `props` when the component is initialized. You can learn about it in the `props` of [Component Properties](/base/component-property).

The configuration of the `props` property needs to follow different rules according to the difference between `component/components`. When we use a single `component`, our `props` is the type constraint of the `props` in the component:

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent,
            props: {
                p1: "v1"
            }
        }
    ]
});
```

When we use `components`, `props` should be distinguished by the **key** in `components` so that we can know which component the current `props` is to be passed to at runtime:

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            components: {
                top: topComponent,
                bottom: bottomComponent
            },
            props: {
                top: {
                    p1: "v1"
                }
            }
        }
    ]
});
```

In addition to specifying a static object, `props` can also be defined as a function type, and the value of `props` can be customized according to the address to be rendered during rendering. Both `component/components` support the `props` function in the same way:

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent,
            props: (to) => {
                //TODO: Use to for business judgment
                return {
                    message: "I am a parameter"
                };
            }
        }
    ]
});
```

### beforeEnter [Hook before Entering the Route]

`beforeEnter` is a **hook** for the current route. When the route is successfully matched and is about to be rendered, this method will be executed.

Of course, we can also use the global events of `Router` to achieve customized business processing before entering the route. This **hook** provides simple hook capabilities at the route configuration item level.

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent,
            beforeEnter: (to, from, next) => {
                //TODO:
            }
        },
        {
            path: "/home/index",
            component: IndexComponent,
            beforeEnter: [
                (to, from) => {
                    //TODO:
                },
                (to, from) => {
                    //TODO:
                }
            ]
        }
    ]
});
```

For the `hook` function type, please refer to [Component Events](/router/event). They all follow the **NavigationCallback** type specification.

### beforeLeave [Hook before Leaving the Route]

`beforeLeave` is a **hook** for the current route. This method will be executed before leaving the route.

Of course, we can also use the global events of `Router` to achieve customized business processing before entering the route. This **hook** provides simple hook capabilities at the route configuration item level.

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent,
            beforeLeave: (to, from, next) => {
                //TODO:
            }
        },
        {
            path: "/home/index",
            component: IndexComponent,
            beforeLeave: [
                (to, from) => {
                    //TODO：
                },
                (to, from) => {
                    //TODO：
                }
            ]
        }
    ]
});
```

About the `hook` function type, refer to [Component Events](/router/event). They all follow the **NavigationCallback** type specification.

### keepalive [State Preservation]

When navigating away from the current route, it determines whether the loaded view component should preserve its state so that it can be restored to the preserved state when returning.

It is recommended to understand [Component Lifecycle](/base/component-lifecycle) before dealing with state preservation.

The `keepalive` property in routes supports multiple configuration types, and different configuration types have different meanings (**the default value is undefined**):

-   `true`: The component remains alive all the time. You can destroy and refresh the cache by using the **refresh** property when [navigating](/router/change).

-   `'once'`: It means the component only lives once. The component will only be rendered from the cache once. The second time it is rendered, it will be executed as a new component. This is generally suitable for route nodes with `high-frequency access + low-frequency updates`.

-   `false/undefined`: It means no state preservation is done.

```ts
new Router({
    routes: [
        {
            path: "/product/index",
            component: IndexComponent,
            keepalive: "once"
        }
    ]
});
```

For more usage methods, you can learn from [State Preservation](/router/keepalive).
