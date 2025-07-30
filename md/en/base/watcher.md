## Data Subscription-Watcher

This chapter mainly introduces how to subscribe to data changes. Before reading this chapter, it is recommended to first learn about [Data Proxy](/base/observer).

### What is Data Subscription

Data subscription is a data management mechanism that allows us to monitor specific data sets in real-time and respond dynamically. Through subscription, we can actively register for data change notifications. Whenever the data changes, the Core underlying layer will automatically send us a notification. This mechanism not only informs us that the data has changed but also conveys the specific content of the data change in detail, including changes in data values.

In this way, we can respond promptly to data changes, which benefits real-time template rendering, real-time analysis, or decision-making support.

```ts
import { observer, Watcher } from "@joker.front/core";

// Define data proxy
let ob = observer({
    userName: "Zhang San"
});

// Data subscription
let watcher = new Watcher(ob, "userName", (newValue, oldValue) => {
    console.log("Data has changed");
});

// Change the value, which will trigger the subscribed listening function
ob.username = "Li Si";
```

We can also customize the `Watcher` to achieve subscription to proxy data. When using a custom `Watcher` for listening, ensure that it is destroyed when it is no longer needed to avoid unnecessary waste of data subscription resources.

In a component, you can use the `$watch` function in [Component](/base/component-api) to achieve data subscription. Using this method, you don't need to consider the destruction of data subscription. It will be cleaned up when the component is destroyed. Of course, you can also actively call `destroy()` to destroy a certain data subscription rule before destruction.

### Watcher

`Watcher` is a data subscription class within Core. It not only provides the subscription of reactive data relationships within components but also allows developers to customize data subscription rules outside components.

Next, let's take a look at several calling methods (overloads) of `Watcher`:

#### The First One

```ts
new Watcher(
    dataProxyObject/expressionFunction,
    propertyNameToAccess [can be separated by ","],
    changeNotificationFunction,
    whetherToForceNotification (notify even if the data value changes but remains the same, default is false)
)

// For example
new Wathcer(ob, 'userInfo.userName', (nv) => {}, false)
new Wathcer(() => ob, 'userInfo.userName', (nv) => {}, false)
```

#### The Second One (Recommended)

```ts
new Watcher(dataAccessExpressionFunction, changeNotificationFunction);

// For example:
new Watcher(
    () => ob.userInfo.userName,
    (nv) => {}
);

// If you want to subscribe to changes in multiple values
new Watcher(
    () => [ob.userInfo.userName, ob.userInfo.age],
    (nv) => {}
);
```

Next, let's take a look at the running effect through an example:

!!!demo1!!!

> It should be noted that when `forceCallBack whether to force notification` is **false** (the default is false), if the expression returns an array/object, as long as each item in the object is equal, regardless of whether the pointer (reference type) is the same, it is **not considered a change**. This can effectively reduce unnecessary data subscription notifications.

### Attributes/Methods

By creating a `Wathcer`, we get a data subscription object (the `$watch` function in a component also returns a `Watcher`-type result), and we can use this subscription object to perform more complex operations:

#### value

The data subscription provides us with the `value` attribute, which allows us to immediately obtain the value of the current expression when creating the data subscription, and this value will be updated synchronously when the data changes:

```ts
let watcher = new Watcher(
    () => ob.userName,
    () => {}
);

// You can immediately get the current value through value
watcher.value;
```

#### destroy()

By calling the `destroy()` method, we can destroy this data subscription object.

```ts
let watcher = new Watcher(
    () => ob.userName,
    () => {}
);

// Destroy
watcher.destroy();
```

#### isDestroy

Through this attribute, we can view the current state of data subscription to determine whether it has been destroyed.

```ts
let watcher = new Watcher(
    () => ob.userName,
    () => {}
);

// watcher.isDestroy => false

// Destroy
watcher.destroy();

// watcher.isDestroy => true
```
