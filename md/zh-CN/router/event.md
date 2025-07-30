## 路由事件/状态

本章节主要探讨了在路由跳转过程中涉及的事件及其应用，利用这些事件可以实现多种复杂的功能和优化。

### isReady [路由初始化完毕]

在路由初始化时，`Joker Core`会根据当前的地址做视图初始化，并完成首次路由加载。

`isReady` 方法不仅指示了一个类实例化的完成，同时也代表了一次路由的加载成功或失败。只有当路由完成首次加载后，才能认为页面路由已经准备就绪。

```ts
import { Router } from "@joker.front/router";

let appRouter = new Router({
    //...
});

appRouter.isReady().then(() => {
    //TODO:
});
```

`isReady` 函数返回一个 **Promise** 对象，允许我们通过 `then` 方法来监听页面路由的首次成功加载，并通过 `catch` 方法来处理首次路由加载失败的情况。

### errorCallbacks [异常处理]

您可以使用 errorCallbacks 集合在任意位置监听全局路由异常。

```ts
import { Router } from "@joker.front/router";

let appRouter = new Router({
    //...
});

appRouter.errorCallbacks.add((err, to, from) => {
    //err: 错误数据
    //to:目标地址
    //from:来源地址
});
```

其中`err`参数除了原生错误类型外，也可能是内部`NavigationError`错误类型，该类型包括以下属性：

| 属性名 | 说明                   | 类型                                           |
| ------ | ---------------------- | ---------------------------------------------- |
| type   | 错误类型               | NavigationErrorTypes（在后面会介绍该枚举信息） |
| from   | 来源地址               | RouteLocation                                  |
| to     | 目标地址 RouteLocation | RouteLocationRaw                               |

其中`NavigationErrorTypes`枚举包括：

```ts
export const enum NavigationErrorTypes {
    /**重定向**/
    REDIRECT,
    /**终止 */
    ABORTED,
    /**取消 */
    CANCELLED,
    /**存在多个相同，无明确指向 */
    SAME,
    /** 未匹配到任何路由记录 */
    MATCHER_NOT_FOUND = 4
}
```

我们可以通过 Joker Router 中提供的`isNavigationError`函数来判断当前错误对象是否是`NavigationError`类型。

```ts
import { isNavigationError } from "@joker.front/router";

isNavigationError(err); //====> true/false
```

### beforeRouteCallbacks [跳转前]

我们可以在`beforeRouteCallbacks`中添加监听函数，以便在路由跳转前实现切面事件的监听。这样，我们可以在路由跳转之前执行一些自定义的操作，例如验证用户权限、记录日志等。这种方法可以让我们更加灵活地控制路由跳转的过程，并优化应用程序的性能和用户体验。

```ts
import { Router } from "@joker.front/router";

let appRouter = new Router({
    //...
});

appRouter.beforeRouteCallbacks.add((to, from, next) => {
    //to:目标地址
    //from:来源地址
    //next:执行下一步
});
```

事件类型`NavigationCallback`请看本章结尾小结介绍。

### afterRouteCallbacks [跳转后]

`afterRouteCallbacks` 作为跳转后的 HOOK，使用方式和`beforeRouteCallbacks`基本一致，不同的是它没有**next**/**return**控制流转的机制。

```ts
import { Router } from "@joker.front/router";

let appRouter = new Router({
    //...
});

appRouter.beforeRouteCallbacks.add((to, from, err) => {
    //to:目标地址
    //from:来源地址
    //err:错误信息，可参考errorCallbacks中的错误类型说明
});
```

> 需要指出的是，`afterRouteCallbacks` 作为路由跳转的切面事件，它反映的是路由切换的状态，而非页面加载的完成状态。若想监听`视图容器`加载完成状态，可通过[router-view](/router/router-view)中的**updated**事件去监听。

### beforeEnter / beforeLeave

`beforeEnter` 和 `beforeLeave` 是 Joker Router 中的两个生命周期钩子，它们特定于路由记录的配置属性。与全局事件监听不同，这些钩子允许我们在路由层面的具体路由项上进行切面事件的管理。通过为单个路由配置这些生命周期钩子，我们能够更精细地控制路由的进入和离开行为。

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

事件类型`NavigationCallback`请看本章结尾小结介绍。

### NavigationCallback [事件处理类型]

`NavigationCallback`作为事件处理类型，无论是全局事件还是路由项生命周期事件，都遵循该类型的规范。

```ts
export type NavigationCallback = (
    to: RouteLocation,
    from: RouteLocation,
    next: NavigationNextCallback
) => Awaitable<NavigationCallbackReturn>;

export type NavigationCallbackReturn = Error | RouteLocationRaw | boolean | undefined | void;
```

该类返回`Promise`，以实现异步处理效果。

参数说明：

| 参数 | 说明             | 类型          |
| ---- | ---------------- | ------------- |
| to   | 目标地址         | RouteLocation |
| from | 来源地址         | RouteLocation |
| next | 下一步操作，可选 | Function      |

由于我们可以向`beforeRouteCallbacks`注册多个切面事件，所以我们必须控制它的流转顺序和状态。我们可以通过方法返回值或者`next`函数来决定我们是否要向下一步流转，接下来我们一起详细的来了解下：

1. 第一种，通过方法返回值来决定流转，该种模式可以不执行第三个参数`next`。

```ts
appRouter.beforeRouteCallbacks.add((to, from) => {
    //return false;
    //return new Error('自定义异常')
    //return '重定向地址';
    //return {path:'重定向地址'}
    //return true/undefined/... 执行下一个HOOK
});
```

返回类型说明

| 类型   | 说明                                                                                                        |
| ------ | ----------------------------------------------------------------------------------------------------------- |
| false  | 终止本次跳转，并触发`NavigationErrorTypes.ABORTED`类型错误                                                  |
| Error  | 终止本次跳转，并触发 Error 事件                                                                             |
| string | 重定向到指定地址，并触发`NavigationErrorTypes.REDIRECT`类型错误                                             |
| object | 重定向到指定地址，类型符合[RouteLocationRaw](/router/change)，并触发`NavigationErrorTypes.REDIRECT`类型错误 |
| 其他   | 执行下一个 HOOK                                                                                             |

2. 第二种，通过执行`next`函数来决定是否流转。

```ts
appRouter.beforeRouteCallbacks.add((to, from, next) => {
    //next(false);
    //next(new Error('自定义异常'))
    //next('重定向地址');
    //next({path:'重定向地址'})
    //next(true/undefined/...) 执行下一个HOOK
});
```

建议在 `next` 方法执行之后不再包含其他业务代码，以保证流程的清晰和专注。

> 通过上面两种控制流转的方式，我们可以了解到`beforeRouteCallbacks`是多个处理 HOOK，我们会逐一按序执行，当所有 HOOK 顺序执行（没有终止/重定向）完毕后，才会开始执行本次路由跳转。

> 我们允许在方法中使用 `async/await` 语法来处理 `Promise`，以此实现异步业务逻辑。
