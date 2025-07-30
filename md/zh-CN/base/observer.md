## 数据代理

本章主要介绍如何将数据进行代理。

### 声明响应式状态

我们可以在任何脚本文件中使用 Core 提供的`observer`、`ShallowObserver`方法来对一个对象进行代理劫持。

我们可以在[组件](/base/component)的 `model` 属性中指定需要被代理的属性。这些属性会在组件加载之前通过 `observer` 函数进行数据代理，以便在属性值发生变化时能够执行相应的操作。

```ts
import { observer } from "@joker.front/core";

let obj = observer({ userName: "张三" });

let arr = observer([1, 2, 3, 4]);
```

> 通常情况下，该函数一般会配合 watcher[数据订阅](/base/watcher)一起使用。若确定该对象不会被订阅，不建议做数据代理操作，以免造成不必要的性能开销。

### observer 数据代理劫持

`observer` 是一个广泛应用的通用数据代理函数，它能够对对象的所有深层属性进行实时的数据代理操作。此外，该函数还能在对象新增属性时，自动对新属性值执行代理劫持，确保数据变化能够被即时监测和处理。

该方法提供两个参数配置：

-   需要被代理的**对象**，该参数必须是对象类型。
-   是否 clone（可选），默认为 false，我们可以设置为 true，来 clone 新的对象进行代理，而不污染原始数据。

这里的需要代理的对象，在类型上有以下要求：

-   一个纯粹的对象 或 数组
-   可扩展 Object.isExtensible
-   非冻结 Object.isFrozen

当我们想对一个复杂的对象做数据代理劫持，并且还想排出某些不需要代理的数据时，可以使用冻结方法，冻结的属性可避免数据代理操纵。

或者你也可以为某一个对象添加一个需要被代理的属性：

```ts
defineObserverProperty(obj, "keyName", {
    userName: "张三"
});
```

`defineObserverProperty`该方法可以实现向对象中配置一个属性，并将该属性的值做代理操作。

### ShallowObserver 数据浅代理劫持

`ShallowObserver` 是一种数据代理机制，与 `observer` 相比，它能够对任意数据类型进行代理劫持。然而，它的区别在于 `ShallowObserver` 不会对对象或数组的深层嵌套属性进行代理，而只针对直接传入的值执行数据代理。

```ts
import { ShallowObserver } from "@joker.front/core";

let obj = new ShallowObserver({ userName: "张三" });
//obj.value  => 张三

let arr = new ShallowObserver([1, 2, 3, 4]);
//obj.value  => [1, 2, 3, 4]

let age = new ShallowObserver(12);
//obj.value  => 12

let message = new ShallowObserver("我是提示");
//obj.value  => 我是提示
```

通过`ShallowObserver`我们会得到一个代理对象，我们可以通过获取该对象的 `value`属性来获取当前代理的值，获取值会被**订阅**，并在值更新时进行订阅通知。

除此之外我们也可以通过其提供的`isChanged`属性来判断当前值有没有变更过：

```ts
let message = new ShallowObserver("我是提示");
//obj.isChanged  => false

//更新值
message.value = "我是新的提示";
//obj.isChanged  => true
```
