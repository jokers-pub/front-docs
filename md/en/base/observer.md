## Data Proxy  

This chapter focuses on how to proxy data.  

### Declaring Reactive State  

We can use the `observer` and `ShallowObserver` methods provided by Core in any script file to intercept and proxy an object.  

We can specify the properties to be proxied in the `model` attribute of a [Component](/base/component). These properties will be proxied via the `observer` function before the component loads, enabling operations to be executed when property values change.  

```ts  
import { observer } from "@joker.front/core";  

let obj = observer({ userName: "Zhang San" });  

let arr = observer([1, 2, 3, 4]);  
```  

> Typically, this function is used in conjunction with [Data Subscription](/base/watcher). If the object is not intended to be subscribed, it is not recommended to perform data proxying to avoid unnecessary performance overhead.  

### Observer Deep Proxy Interception  

`observer` is a widely-used generic data proxy function that performs real-time proxying on all deeply nested properties of an object. Additionally, it can automatically intercept and proxy newly added properties, ensuring that data changes are promptly monitored and processed.  

This method provides two parameter configurations:  

-   The **object** to be proxied, which must be of an object type.  
-   Whether to `clone` (optional, defaults to `false`). Setting this to `true` clones a new object for proxying without modifying the original data.  

The object to be proxied must meet the following type requirements:  
-   A plain object or array  
-   Extensible (`Object.isExtensible`)  
-   Not frozen (`Object.isFrozen`)  

When proxying a complex object while excluding certain properties, freezing methods can be used to prevent unwanted interception.  

Alternatively, you can add a specific property to an object that requires proxying:  

```ts  
defineObserverProperty(obj, "keyName", {  
    userName: "Zhang San"  
});  
```  

The `defineObserverProperty` method allows configuring a property on an object and proxying its value.  

### ShallowObserver Shallow Proxy Interception  

`ShallowObserver` is a data proxy mechanism that, unlike `observer`, can intercept values of any data type. However, it differs in that `ShallowObserver` does not proxy deeply nested properties of objects or arrays—it only performs interception on the directly provided value.  

```ts  
import { ShallowObserver } from "@joker.front/core";  

let obj = new ShallowObserver({ userName: "Zhang San" });  
// obj.value  => Zhang San  

let arr = new ShallowObserver([1, 2, 3, 4]);  
// obj.value  => [1, 2, 3, 4]  

let age = new ShallowObserver(12);  
// obj.value  => 12  

let message = new ShallowObserver("I am a notification");  
// obj.value  => I am a notification  
```  

Using `ShallowObserver`, we obtain a proxied object whose `value` property can be accessed to retrieve the current proxied value. Retrieving the value triggers **subscription**, and updates notify subscribers.  

Moreover, the `isChanged` property can be used to determine whether the value has been modified:  

```ts  
let message = new ShallowObserver("I am a notification");  
// obj.isChanged  => false  

// Update the value  
message.value = "I am a new notification";  
// obj.isChanged  => true  
```