## 滚动行为

Joker Router 内部提供了页面跳转后的滚动条交互 HOOK，我们可以利用这个参数来实现页面切换时对滚动条位置的精确控制。

### 如何使用

我们可以在初始化 Router 时通过`scrollBehavior`属性来配置我们的滚动条行为，该 HOOK 作为全局路由切面，在路由跳转完毕后触发该方法。

```ts
import { Router } from "@joker.front/rourter";

new Router({
    scrollBehavior: (to, from, savePosition) => {
        //路由跳转后滚动条自定义操作方法
    }
});
```

### 参数说明

| 参数名称     | 说明                                                       | 类型                       |
| ------------ | ---------------------------------------------------------- | -------------------------- |
| to           | 目标地址                                                   | RouteLocation              |
| from         | 来源地址                                                   | RouteLocation              |
| savePosition | 目标地址已保存的滚动条位置信息（第一次时该值为 undefined） | ScrollPosition / undefined |

### 返回类型

`scrollBehavior` 提供了多种返回类型，每种类型都对应着不同的处理逻辑，以确保页面跳转时滚动条的行为符合预期。

```ts
export type RouteScrollBehavior = (
    to: RouteLocation,
    from: RouteLocation,
    savedPosition: ScrollPosition | undefined
) => Awaitable<ScrollPosition | false | void>;
```

首先该 HOOK 是支持`Promise`操作的，并且根据返回值不同有不同的行为操作。

| 返回类型       | 说明                                                                 |
| -------------- | -------------------------------------------------------------------- |
| ScrollPosition | 返回新的 scroll 值，Joker Router 会根据返回的值执行`window.scrollTo` |
| false          | 不需要进行 scroll 操作                                               |
| undefined      | 不需要进行 scroll 操作                                               |

### ScrollPosition

我们可以返回`ScrollPosition`类型数据，以便让 Joker Router 去控制滚动条行为。

1. 返回`top`/`left`，来控制 window 滚动条。

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

2. 设置元素`Element`，使其滚动到该元素的位置。

```ts
new Router({
    scrollBehavior: (to, from, savePosition) => {
        return {
            el: document.getElementById("main")
        };
    }
});
```

### 延迟滚动

在某些场景下，你可能需要在页面滚动前等待一段时间，比如在过渡效果期间，以确保过渡完全结束后再进行滚动。为了实现这一点，你可以返回一个 Promise，该 Promise 在解决时提供所需的位置描述符。以下是一个示例，其中我们在滚动之前等待了 500 毫秒：

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
