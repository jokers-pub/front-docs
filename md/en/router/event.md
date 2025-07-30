## Route Events/States

This section mainly explores the events involved in the route navigation process and their applications. Leveraging these events can help us achieve various complex functions and optimizations.

### isReady [Route Initialization Completed]

During route initialization, `Joker Core` initializes the view based on the current address and completes the first-time route loading.

The `isReady` method not only indicates the completion of class instantiation but also represents the success or failure of a route loading. Only after the route has completed its first-time loading can we consider the page route to be ready.

```ts
import { Router } from "@joker.front/router";

let appRouter = new Router({
    //...
});

appRouter.isReady().then(() => {
    //TODO:
});
```

The `isReady` function returns a **Promise** object, allowing us to use the `then` method to listen for the successful first-time loading of the page route and the `catch` method to handle the failure of the first-time route loading.

### errorCallbacks [Exception Handling]

You can use the `errorCallbacks` collection to listen for global route exceptions anywhere.

```ts
import { Router } from "@joker.front/router";

let appRouter = new Router({
    //...
});

appRouter.errorCallbacks.add((err, to, from) => {
    //err: Error data
    //to: Target address
    //from: Source address
});
```

In addition to the native error type, the `err` parameter may also be the internal `NavigationError` error type. This type includes the following properties:

| Property Name | Description                  | Type                                                                 |
| ------------- | ---------------------------- | -------------------------------------------------------------------- |
| type          | Error type                   | NavigationErrorTypes (The enum information will be introduced later) |
| from          | Source address               | RouteLocation                                                        |
| to            | Target address RouteLocation | RouteLocationRaw                                                     |

The `NavigationErrorTypes` enum includes:

```ts
export const enum NavigationErrorTypes {
    /**Redirect */
    REDIRECT,
    /**Aborted */
    ABORTED,
    /**Cancelled */
    CANCELLED,
    /**Multiple identical ones without a clear target */
    SAME,
    /** No route record was matched */
    MATCHER_NOT_FOUND = 4
}
```

We can use the `isNavigationError` function provided by Joker Router to determine whether the current error object is of the `NavigationError` type.

```ts
import { isNavigationError } from "@joker.front/router";

isNavigationError(err); //====> true/false
```

### beforeRouteCallbacks [Before Navigation]

We can add listener functions to `beforeRouteCallbacks` to implement aspect-oriented event listening before route navigation. In this way, we can perform some custom operations before route navigation, such as verifying user permissions and logging. This method allows us to control the route navigation process more flexibly and optimize the performance and user experience of the application.

```ts
import { Router } from "@joker.front/router";

let appRouter = new Router({
    //...
});

appRouter.beforeRouteCallbacks.add((to, from, next) => {
    //to: Target address
    //from: Source address
    //next: Execute the next step
});
```

For the event type `NavigationCallback`, please refer to the summary at the end of this chapter.

### afterRouteCallbacks [After Navigation]

`afterRouteCallbacks` serves as a hook after navigation. Its usage is basically the same as that of `beforeRouteCallbacks`, except that it doesn't have the **next**/**return** mechanism to control the flow.

```ts
import { Router } from "@joker.front/router";

let appRouter = new Router({
    //...
});

appRouter.beforeRouteCallbacks.add((to, from, err) => {
    //to: Target address
    //from: Source address
    //err: Error information. Refer to the error type description in errorCallbacks.
});
```

> It should be noted that `afterRouteCallbacks`, as an aspect-oriented event for route navigation, reflects the state of route switching, not the completion state of page loading. If you want to listen for the completion state of the `view container` loading, you can use the **updated** event in [router-view](/router/router-view) to listen.

### beforeEnter / beforeLeave

`beforeEnter` and `beforeLeave` are two lifecycle hooks in Joker Router. They are specific configuration properties for route records. Different from global event listening, these hooks allow us to manage aspect-oriented events at the route-level for specific route items. By configuring these lifecycle hooks for individual routes, we can control the entry and exit behaviors of routes more precisely.

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

For the event type `NavigationCallback`, please refer to the summary at the end of this chapter.

### NavigationCallback [Event Handling Type]

`NavigationCallback` is the event-handling type. Both global events and route-item lifecycle events follow the specifications of this type.

```ts
export type NavigationCallback = (
    to: RouteLocation,
    from: RouteLocation,
    next: NavigationNextCallback
) => Awaitable<NavigationCallbackReturn>;

export type NavigationCallbackReturn = Error | RouteLocationRaw | boolean | undefined | void;
```

This class returns a `Promise` to achieve asynchronous processing.

Parameter descriptions:

| Parameter | Description              | Type          |
| --------- | ------------------------ | ------------- |
| to        | Target address           | RouteLocation |
| from      | Source address           | RouteLocation |
| next      | Next operation, optional | Function      |

Since we can register multiple aspect-oriented events to `beforeRouteCallbacks`, we must control their flow order and state. We can decide whether to proceed to the next step through the method return value or the `next` function. Let's take a detailed look:

1. The first way is to decide the flow through the method return value. In this mode, the third parameter `next` doesn't need to be executed.

```ts
appRouter.beforeRouteCallbacks.add((to, from) => {
    //return false;
    //return new Error('Custom exception')
    //return 'Redirect address';
    //return {path:'Redirect address'}
    //return true/undefined/... Execute the next hook
});
```

Return type descriptions:

| Type   | Description                                                                                                                                              |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| false  | Terminate the current navigation and trigger an error of type `NavigationErrorTypes.ABORTED`                                                             |
| Error  | Terminate the current navigation and trigger an Error event                                                                                              |
| string | Redirect to the specified address and trigger an error of type `NavigationErrorTypes.REDIRECT`                                                           |
| object | Redirect to the specified address. The type conforms to [RouteLocationRaw](/router/change), and trigger an error of type `NavigationErrorTypes.REDIRECT` |
| Others | Execute the next hook                                                                                                                                    |

2. The second way is to decide whether to proceed through the `next` function.

```ts
appRouter.beforeRouteCallbacks.add((to, from, next) => {
    //next(false);
    //next(new Error('Custom exception'))
    //next('Redirect address');
    //next({path:'Redirect address'})
    //next(true/undefined/...) Execute the next hook
});
```

It is recommended not to include other business code after the `next` method is executed to ensure the clarity and focus of the process.

> Through the above two ways of controlling the flow, we can see that `beforeRouteCallbacks` consists of multiple processing hooks. We will execute them one by one in order. Only after all hooks have been executed in sequence (without termination/redirection) will the current route navigation start.

> We allow the use of `async/await` syntax in the method to handle `Promise` and implement asynchronous business logic.
