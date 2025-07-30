## 数据订阅 Watcher

本章节主要介绍如何对数据变更进行订阅。在阅读本章节前，建议先学习[数据代理](/base/observer)。

### 什么是数据订阅

数据订阅是一种的数据管理机制，允许我们对特定数据集进行实时的监控和动态的响应。通过订阅，我们能够主动注册对数据的变更通知，这样，每当数据发生变化时，Core 底层将自动向我们发送通知。这种机制不仅告知我们数据已变更，而且还能详细传达数据变更的具体内容，包括数据值的变化。

通过这种方式，我们可以及时地对数据变化做出响应，无论是模板实时渲染、实时分析还是决策支持，都能从中获益。

```ts
import { observer, Watcher } from "@joker.front/core";

//定义数据代理
let ob = observer({
    userName: "张三"
});

//数据订阅
let watcher = new Watcher(ob, "userName", (newValue, oldValue) => {
    console.log("数据发生变更");
});

//更改值，会触发订阅的监听函数
ob.username = "李四";
```

我们可以可以通过自定义`Watcher`来实现对代理数据的订阅，如果使用`Watcher`自定义监听时，请确保它在不需要时被销毁掉，以免造成不必要的数据订阅资源浪费。

在组件中，你可以使用[组件](/base/component-api)中的`$watch`函数去实现数据订阅。使用这种方式你讲不需要考虑数据订阅的销毁，它会在组件销毁时被清理，当然你也可以在销毁前，主动去调用`destroy()`销毁某个数据订阅规则。

### Watcher

`Watcher`作为 Core 内的数据订阅类，它不仅提供了组件内部的响应式数据的关系订阅，也可以让开发人员在组件外部自定义数据订阅规则。

接下来让我们看一下`Watcher`的几种调用方式(重载)：

#### 第一种

```ts
new Watcher(
    数据代理对象/表达式函数 ,
    要访问的属性名[可用"，"分割] ,
    变更通知函数 ,
    是否强制执行通知（当数据值变更但值相同也进行通知，默认为false）
)

//例如
new Wathcer(ob,'userInfo.userName',(nv)=>{},false)
new Wathcer(()=>ob,'userInfo.userName',(nv)=>{},false)
```

#### 第二种（建议使用）

```ts
new Watcher(数据访问表达式函数, 变更通知函数);

//例如：
new Watcher(
    () => ob.userInfo.userName,
    (nv) => {}
);

//若想订阅多个值变更
new Watcher(
    () => [ob.userInfo.userName, ob.userInfo.age],
    (nv) => {}
);
```

接下来使用一个例子看一下运行效果：

!!!demo1!!!

> 值的注意的是，当`forceCallBack是否强制执行通知`为**false**时（默认即为 false），若表达式返回的是数组/对象，只要对象中的每一项相等，无论指针（引用类型）是否一致，都**不算变更**，这样可以有效减少不必要的数据订阅通知。

### 属性/方法

我们通过创建一个`Wathcer`，我们会得到一个数据订阅对象（组件内的`$watch`函数也返回`Wathcer`类型结果），我们可以使用该订阅对象做更复杂的操作：

#### value

数据订阅为我们提供了`value`属性，可以使我们在创建数据订阅时，立即拿到当前的表达式的值，并且该值会在数据变更时同步更新：

```ts
let watcher = new Watcher(
    () => ob.userName,
    () => {}
);

//通过value 可以立即拿到当前的值
watcher.value;
```

#### destroy()

通过调用`destroy()`方法可以销毁该数据订阅对象。

```ts
let watcher = new Watcher(
    () => ob.userName,
    () => {}
);

//销毁
watcher.destroy();
```

#### isDestroy

通过该属性可以查看当前数据订阅的状态，以确定是否被销毁。

```ts
let watcher = new Watcher(
    () => ob.userName,
    () => {}
);

// watcher.isDestroy => false

//销毁
watcher.destroy();

// watcher.isDestroy => true
```
