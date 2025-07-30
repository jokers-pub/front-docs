## Data Proxy

This chapter mainly introduces how to proxy data.

### Declaring Reactive State

We can use the `observer` and `ShallowObserver` methods provided by Core in any script file to proxy and hijack an object.

We can specify the properties to be proxied in the `model` attribute of a [component](/base/component). These properties will be data-proxied by the `observer` function before the component is loaded, so that corresponding operations can be performed when the property values change.

```ts
import { observer } from "@joker.front/core";

let obj = observer({ userName: "Zhang San" });

let arr = observer([1, 2, 3, 4]);
```

> Usually, this function is generally used in conjunction with watcher [data subscription](/base/watcher). If it is certain that the object will not be subscribed, it is not recommended to perform data proxy operations to avoid unnecessary performance overhead.

### observer Data Proxy Hijacking

`observer` is a widely used general-purpose data proxy function. It can perform real-time data proxy operations on all deep-level properties of an object. In addition, when a new property is added to the object, this function can automatically proxy and hijack the new property value to ensure that data changes can be monitored and processed immediately.

This method provides two parameter configurations:

-   The **object** to be proxied, which must be of the object type.
-   Whether to clone (optional), with the default value of false. We can set it to true to clone a new object for proxying without polluting the original data.

The object to be proxied has the following type requirements:

-   A pure object or array
-   Extensible Object.isExtensible
-   Not frozen Object.isFrozen

When we want to perform data proxy hijacking on a complex object and also exclude some data that does not need to be proxied, we can use the freezing method. Frozen properties can avoid data proxy manipulation.

Or you can add a property to an object that needs to be proxied:

```ts
defineObserverProperty(obj, "keyName", {
    userName: "Zhang San"
});
```

The `defineObserverProperty` method can be used to configure a property in an object and proxy the value of this property.

### ShallowObserver Data Shallow Proxy Hijacking

`ShallowObserver` is a data proxy mechanism. Compared with `observer`, it can proxy and hijack any data type. However, the difference is that `ShallowObserver` does not proxy the deeply nested properties of an object or array, but only performs data proxy on the directly passed-in value.

```ts
import { ShallowObserver } from "@joker.front/core";

let obj = new ShallowObserver({ userName: "Zhang San" });
//obj.value  => Zhang San

let arr = new ShallowObserver([1, 2, 3, 4]);
//obj.value  => [1, 2, 3, 4]

let age = new ShallowObserver(12);
//obj.value  => 12

let message = new ShallowObserver("This is a prompt");
//obj.value  => This is a prompt
```

Through `ShallowObserver`, we get a proxy object. We can obtain the currently proxied value by getting the `value` property of this object. Getting the value will be **subscribed** and a subscription notification will be sent when the value is updated.

In addition, we can also use the `isChanged` property it provides to determine whether the current value has changed:

```ts
let message = new ShallowObserver("This is a prompt");
//obj.isChanged  => false

// Update the value
message.value = "This is a new prompt";
//obj.isChanged  => true
```
