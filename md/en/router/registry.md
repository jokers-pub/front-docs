## Route Registration

This section primarily introduces how to register routes and understand the configuration rules for routes.

Currently, two route registration methods are provided: **Initialize Route Configuration** and **Dynamic Route Registration**.

### Initialize Route Configuration

We can configure all known route information for the entire project via the `routes` parameter during route initialization.

```ts
import { Router } from "@joker.front/rourter";

// My Block Page
new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});
```

### Dynamic Route Registration

We provide dynamic route registration methods, which allow us to dynamically manage route matching rules based on environment variables, dynamic variables, and other differences.

```ts
let appRouter = new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", name:"parent" component: MyPage }
    ]
});

appRouter.addRoute({ path: "/index", component: MyPage });

// Add child route to an existing route
appRouter.addRoute({ path: "/children", component: MyPage },'parent')
```

This method supports two parameters:

| Parameter Name      | Description                                                                                    | Parameter Type                                     |
| -----------------   | --------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| route               | The route item to be added                                                                    | `RouteRecordRaw`, same as the initialization route configuration item |
| parentRouteName     | The name of the parent route node. This requires the parent route to be a **named route**. **Optional**, if not configured, it will be treated as a first-level route. | `RouteRecordName(string/symbol)`             |

> It's worth noting that dynamic route registration does not allow registering the landing page address. When the Joker Router **initializes**, it will load the current address/landing page by default. Therefore, when using this method to register routes, **the registration must be completed before rendering the page**.

### Route Configuration Item [RouteRecordRaw]

The **Route Configuration Item** is a crucial data type to understand when registering routes with Joker Router. Whether initializing route items or dynamically registering routes, configuration must follow the **RouteRecordRaw** type.

Below is the detailed attribute description for **RouteRecordRaw**:

### path [Matching Rules]

The `path` attribute configures the matching rules for routes. The `path` offers rich configuration rules—it can be a static address like `/home/index` or a dynamic one like `/user/:id`. Let’s explore the matching rules in detail.

The `path` attribute is of type `string`. We can configure a fixed static address to set route rules:

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

Additionally, we can configure dynamic matching rules using expressions:

#### Dynamic Parameters

We can set dynamic parameters using `:`. The keyword following `:` represents the name of the dynamic parameter.

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

When configured as above, routes like `/user/abc` or `/user/123` will be recognized as matching the current routing rule.

Upon page load, content after `/user/` will be passed as a parameter to the [route information](/router/route) under the **id** parameter.

Accessing `/user` or `/user/abc/xxx` will **not match** the rule, as the `:` dynamic rule is configured only once and is non-repeatable.

#### Regex Constraints

We allow adding regex constraints to `:` dynamic parameters by configuring regex rules inside `()`, such as:

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

Dynamic parameters can be combined with static characters to form complex address matching rules, e.g.:

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

It’s important to note that even with `dynamic + static` concatenation in the expression, we will correctly parse the parameter variable during address conversion. For example, `/home/12hello` will parse the parameter as **id='12'**.

#### Optional Parameters

To make a parameter optional, append `?`. This signifies that the parameter is optional, **not a regex constraint**.

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

For parameters with constraints, append **?** after `()`.

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

We can append `+`/`*` to dynamic parameters to indicate they can repeat. `+` means at least one repetition, while `*` allows optional repetition.

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

Below is a complex static concatenation example:

```ts
new Router({
    routes: [
        {
            path: "/user:id+"
        }
    ]
});

/**
 * /userabc   => true  Parameter is abc
 * /user       => false
 */
```

```ts
new Router({
    routes: [
        {
            path: "/:id(d+)+user"
        }
    ]
});

/**
 * /123user   => true  Parameter is 123
 * /123+user  => false '+' is a variable modifier
 */
```

#### Repeatable + Optional [*]

When configuring the `*` modifier, it signifies the variable is optional and repeatable.

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

We can configure the `redirect` property to implement route redirection.

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

The above code means that when no address is specified, it redirects to `/home/index`.  
**redirect** supports not only string values but also method-based redirection and richer configurations.

More configurations:

```ts
new Router({
    routes: [
        {
            path: "/",
            redirect: {
                name: "NamedRoute",
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

Custom method that receives the current route information and returns a new route. The return type follows the format provided in the **richer configurations** above:

```ts
new Router({
    routes: [
        {
            path: "/",
            redirect: (to: RouteLocationBase) => {
                return {
                    name: "NamedRoute",
                    params: { value: "1" }
                };
            }
        }
    ]
});
```

### name [Named Routes]

We can add a `name` property to a route configuration to name it. Named routes can be quickly referenced during navigation, route additions, etc., using the **name**.

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

### alias [Route Alias]

`alias` supplements the matching address and can be considered an alias for `path`. It can be a string or a string array, following the `path` type specification.

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

`meta` serves as the metadata property for routes, storing custom route data. Configured metadata can be accessed in route lifecycle events or route information for business operations.

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

Usage example:

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

Alternatively, access it via the `router` object in components (see [Route Information](/router/route)).

```ts
import { router } from "@joker.front/router";

if (router.route.value.meta.param === "v1") {
    //TODO:
}
```

### children [Child Routes]

The `children` property configures child routes for the current route, commonly referred to as **nested routes**.

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

The above example creates a `/user` route with two child routes. If their `path` does not start with `/`, the child route matching rule is formed by concatenation (**parent path/child path**):

- `/user/list`
- `/user/info`

If the child route `path` starts with **/**, the parent `path` is ignored, e.g.:

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

This will still resolve to `/user/list` and `/user/info`.  

[Nested Routes](/router/nested-routes) will be covered in a dedicated section.

### component/components [Route Components]

We can use `component` or `components` to configure the view components to be loaded for the current route. The difference is:  

- `component`: The route loads a single component (one `<router-view>` tag in the layout).  
- `components`: The route loads multiple components (multiple named `<router-view>` containers in the layout).  

For `<router-view>`, refer to [Dynamic Containers](/router/router-view).  

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

Both `component` and `components` support lazy loading:  

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

### props [Component Props]

The `props` property typically configures parameters for `component` or `components`. Parameters defined in **props** are passed as `props` during component initialization (see [Component Properties](/base/component-property)).

Configuration depends on whether `component` or `components` is used. For a single `component`, `props` follows the component's type constraints:  

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

For `components`, `props` must map to the `components` **key** to identify which component the props should be passed to:  

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

In addition to static objects, `props` can be a function that dynamically generates props based on the rendering address. Both `component` and `components` support this:  

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent,
            props: (to) => {
                //TODO: Use `to` for business logic
                return {
                    message: "I am a parameter"
                };
            }
        }
    ]
});
```

### beforeEnter [Route Entry Hook]

`beforeEnter` serves as the **hook** for the current route. It executes when the route matches but before rendering begins.  

Global Router events can also handle pre-rendering business logic. This **hook** provides a simple hook mechanism at the route configuration level.  

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

For `hook` function types, refer to [Component Events](/router/event), which adhere to the **NavigationCallback** type.

### beforeLeave [Route Exit Hook]

`beforeLeave` serves as the **hook** for the current route. It executes when leaving the route.  

Global Router events can also handle this, but this **hook** provides a simple hook mechanism at the route configuration level.  

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

For `hook` function types, refer to [Component Events](/router/event), which adhere to the **NavigationCallback** type.

### keepalive [State Retention]

Whether the loaded view component should retain its state when navigating away, allowing it to restore upon returning.  

For state retention, first review [Component Lifecycle](/base/component-lifecycle).  

The `keepalive` property supports various configurations (**default: undefined**):

- `true`: Always retains state. Cache can be destroyed and refreshed using the **refresh** property during [navigation](/router/change).  
- `'once'`: Retains state only once. The component renders from cache only the first time; subsequent renders treat it as a new component. Suitable for **high-frequency access, low-frequency update** routes.  
- `false/undefined`: No state retention.  

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

For more details, see [State Retention](/router/keepalive).