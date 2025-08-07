## Scroll Behavior

Joker Router internally provides a hook for scroll bar interaction after page navigation. We can utilize this parameter to achieve precise control over scrollbar position during page transitions.

### How to Use

We can configure our scroll behavior through the `scrollBehavior` property when initializing the Router. This hook serves as a global routing aspect and triggers after route navigation is completed.

```ts
import { Router } from "@joker.front/rourter";

new Router({
    scrollBehavior: (to, from, savePosition) => {
        // Custom scroll operation method after route navigation
    }
});
```

### Parameter Description

| Parameter Name | Description | Type |
| ------------ | ---------------------------------------------------------- | -------------------------- |
| to           | Target route location | RouteLocation |
| from         | Source route location | RouteLocation |
| savePosition | Saved scroll position information of target route (undefined on first visit) | ScrollPosition / undefined |

### Return Types

The `scrollBehavior` hook supports multiple return types, each corresponding to different handling logic to ensure expected scroll behavior during page transitions.

```ts
export type RouteScrollBehavior = (
    to: RouteLocation,
    from: RouteLocation,
    savedPosition: ScrollPosition | undefined
) => Awaitable<ScrollPosition | false | void>;
```

This hook supports Promise operations and exhibits different behaviors based on the return value:

| Return Type | Description |
| ------------ | -------------------------------------------------------------------- |
| ScrollPosition | Returns new scroll values. Joker Router will execute `window.scrollTo` with these values |
| false          | No scroll operation needed |
| undefined      | No scroll operation needed |

### ScrollPosition

We can return data of type `ScrollPosition` to allow Joker Router to control scroll behavior.

1. Return `top`/`left` to control window scrollbar.

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

2. Set element `Element` to scroll to its position.

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

In certain scenarios, you may need to wait for a period before page scrolling, such as during transition effects, to ensure scrolling occurs only after the transition completely finishes. To achieve this, you can return a Promise that resolves with the required position descriptor. Here's an example where we wait 500ms before scrolling:

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