## 事件总线

组件间的通讯，除了`传参`、`事件`之外，我们还提供全局`事件总线`来处理事件之间的广播通讯需求。

### 概述

`Event Bus` 是一种事件总线架构模式，它通过中央事件调度中心来解耦组件间的事件通信。与组件内部直接处理事件相比，`Event Bus` 允许事件在不同的组件之间传递，无需组件间直接交互，从而**降低**了它们之间的**耦合度**。
通常，`Event Bus` 用于处理全局性的事件，如用户登录成功、窗口尺寸调整等。这些事件往往与**特定的动作**或**操作**相关联，例如用户点击按钮或浏览器窗口的尺寸变化。
`Event Bus` 可以在组件内部或任何脚本中被使用，但它需要在适当的时机进行全局事件的注册与卸载，以确保资源得到有效管理和内存的合理释放。

### 如何使用

事件总线的定义

```ts
import { EventBus } from "@joker.front/core";

export let userEvent = new EventBus<{
    login: { userName: string; id: string };
    registory: { userId: string };
}>();
```

事件的广播

```ts
import { userEvent } from "./event-bus/user-event";

userEvent.trigger("login", {
    userName: "张三",
    id: "123"
});
```

事件的监听

```ts
import { userEvent } from "./event-bus/user-event";

let destroyEvent = userEvent.on("login", (e, userInfo) => {
    let userName = userInfo.userName;
    //TODO:...
});
```

事件处理函数会接收到两个参数，第一个参数为事件处理对象，第二个为事件参数，其中事件处理对象会提供两个属性供大家使用：

-   **stopPropagation**: Function 阻止事件继续广播
-   **callTimes**: Number 该事件在本次处理过程中已经被响应了多少次

> 在使用`on`或者`once`来进行事件注册时，注册后会立即返回一个`destroy销毁`函数，可通过调用该函数来立即销毁本次注册的事件，当然你可以可以使用`off`的方式来进行删除。
> 注册事件后，会立即返回一个销毁方法，可调用该销毁方法来注销该事件的注册。
> 注册事件时，可使用`*`通配符，来接收所有事件的处理，可以在事件处理函数的第一个参数`e`中获取当前事件名称。

```ts
import { userEvent } from "./event-bus/user-event";

//卸载所有login事件
userEvent.off("login");

//卸载user下所有事件
userEvent.off();
```

> 我们可以在事件总线初始化时，指定泛型类型，来约束事件参数的类型。

### API

| 方法名称 | 说明                   | 参数                           |
| -------- | ---------------------- | ------------------------------ |
| on       | 事件注册               | 事件名称，事件处理函数         |
| off      | 事件卸载               | 事件名称，事件处理函数（可选） |
| trigger  | 触发事件               | 事件名称，事件参数（可选）     |
| once     | 事件注册（只响应一次） | 事件名称，事件处理函数         |
