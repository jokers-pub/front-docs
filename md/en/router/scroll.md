## Scroll Behavior

Joker Router internally provides a scroll-bar interaction hook after page navigation. We can use this parameter to precisely control the position of the scroll bar when switching pages.

### How to Use

We can configure the scroll-bar behavior through the `scrollBehavior` property when initializing the Router. This hook serves as a global route aspect and is triggered after the route navigation is completed.

```ts
import { Router } from "@joker.front/router";

new Router({
    scrollBehavior: (to, from, savePosition) => {
        // Custom operation method for the scroll bar after route navigation
    }
});
```

### Parameter Description

| Parameter Name | Description                                                                                                    | Type                       |
| -------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------- |
| to             | The target address                                                                                             | RouteLocation              |
| from           | The source address                                                                                             | RouteLocation              |
| savePosition   | The saved scroll-bar position information of the target address (this value is `undefined` for the first time) | ScrollPosition / undefined |

### Return Types

`scrollBehavior` provides multiple return types, and each type corresponds to different processing logics to ensure that the behavior of the scroll bar during page navigation meets expectations.

```ts
export type RouteScrollBehavior = (
    to: RouteLocation,
    from: RouteLocation,
    savedPosition: ScrollPosition | undefined
) => Awaitable<ScrollPosition | false | void>;
```

First of all, this hook supports `Promise` operations, and different return values lead to different behaviors.

| Return Type    | Description                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| ScrollPosition | Returns a new `scroll` value, and Joker Router will execute `window.scrollTo` based on the returned value |
| false          | No `scroll` operation is required                                                                         |
| undefined      | No `scroll` operation is required                                                                         |

### ScrollPosition

We can return data of the `ScrollPosition` type to let Joker Router control the scroll-bar behavior.

1. Return `top`/`left` to control the window scroll bar.

```ts
new Router({
    scrollBehavior: (to, from, savePosition) => {
        return {
            top: 0,
            left: 0
        };
    }
});
```

2. Set an `Element` to scroll to the position of that element.

```ts
new Router({
    scrollBehavior: (to, from, savePosition) => {
        return {
            el: document.getElementById("main")
        };
    }
});
```

### Delayed Scrolling

In some scenarios, you may need to wait for a period of time before scrolling the page, such as during a transition effect, to ensure that the transition is completely finished before scrolling. To achieve this, you can return a Promise that resolves with the required position descriptor. Here is an example where we wait for 500 milliseconds before scrolling:

```ts
new Router({
    scrollBehavior: async (to, from, savePosition) => {
        await sleep(500);

        return {
            top: 0
        };
    }
});
```
