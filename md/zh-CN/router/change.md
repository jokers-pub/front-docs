## 路由跳转

本章节主要介绍如何进行路由跳转，如何去传递路由参数。

### 原生跳转

我们可以借用`a`标签的**href**属性直接实现路由跳转，以`Hash`模式为例：

!!!demo1!!!

### RouteLocationRaw [类型]

除了原生 link 模式跳转外，我们还提供了 push、replace 等跳转方式，这些通过 js 方法跳转都必须传递`RouteLocationRaw`类型参数作为跳转目标信息，我们先介绍下该类型的属性规范。

```ts
type RouteLocationRaw = string | RouteLocationPathRaw | RouteLocationNameRaw;
```

接下来我们会以`push`方法为例来介绍下该参数的使用类型。

1. string

我们可以直接设置为字符串地址，若在`hash`模式下，`#`是可以忽略的。

```ts
push("router/init");
```

2. RouteLocationPathRaw [path 模式]

`path` 模式跳转，并支持各种功能配置。

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

该类型的完整属性：

| 属性名  | 说明                                                    | 类型         |
| ------- | ------------------------------------------------------- | ------------ |
| path    | 跳转地址                                                | string       |
| replace | 是否不记录该路由历史                                    | boolean      |
| force   | 强制跳转，一般适用于相同地址的强制刷新                  | boolean      |
| refresh | 刷新缓存，当页面存在 keepalive 时，可通过该属性刷新缓存 | boolean      |
| state   | 路由状态数据                                            | HistoryState |
| hash    | 当使用`HTML History模式`下使用 hash 做参数配置          | string       |
| query   | URL Query 传参                                          | object       |

3. RouteLocationNameRaw [name 模式]

`name` 模式跳转，并支持各种功能配置。name 相关知识，请了解[注册路由](/router/registry)中的 name 属性。

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

该类型的完整属性：

| 属性名  | 说明                                                    | 类型         |
| ------- | ------------------------------------------------------- | ------------ |
| name    | 目标路由名[命名路由]                                    | string       |
| params  | 路由参数                                                | object       |
| replace | 是否不记录该路由历史                                    | boolean      |
| force   | 强制跳转，一般适用于相同地址的强制刷新                  | boolean      |
| refresh | 刷新缓存，当页面存在 keepalive 时，可通过该属性刷新缓存 | boolean      |
| state   | 路由状态数据                                            | HistoryState |
| hash    | 当使用`HTML History模式`下使用 hash 做参数配置          | string       |
| query   | URL Query 传参                                          | object       |

> 值的注意的是只有`name`模式下**才允许**传递`params`，而在`path`模式下，params 会根据当前**path** 去解析动态参数。

### push

导航到一个地址。内部调用 history.pushState 来有效改变 URL。

!!!demo2!!!

push 方法支持一个参数，参数类型为`RouteLocationRaw`。

### replace

和 push 方法一样，它使用了 history.replaceState 以换掉改变浏览器的 URL，但它不会在历史记录列表中创建新的条目，而是替换当前条目。这意味着当用户点击后退按钮时，他们不会返回到之前的状态，而是直接返回到初始状态。

!!!demo3!!!

replace 方法会将当前地址忽略历史，它支持一个参数，参数类型为`RouteLocationRaw`。

### go

跳转方法，它支持向前、向后跳转。

```ts
import { router } from "@joker.front/router";

router.go(1);

router.go(-1);
```

它支持整数类型参数，正数为向后跳转，负数为向前跳转。

### back

返回上一级。

```ts
import { router } from "@joker.front/router";

router.back();
```

### forward

向前跳转，仅在有返回历史时生效。

```ts
import { router } from "@joker.front/router";

router.forward();
```
