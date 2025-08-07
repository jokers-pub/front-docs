## Data Subscription Watcher  

This chapter introduces how to subscribe to data changes. Before reading this section, it is recommended to first learn about [Data Proxy](/base/observer).  

### What is Data Subscription?  

Data subscription is a data management mechanism that allows real-time monitoring and dynamic responses to changes in specific datasets. By subscribing, we can proactively register for notifications of data changes. Whenever the data is modified, the Core layer will automatically send notifications. This mechanism not only informs us that the data has changed but also provides detailed information about the specific changes, including modifications to data values.  

This approach enables timely reactions to data changes, benefiting real-time template rendering, real-time analysis, decision support, and more.  

```ts
import { observer, Watcher } from "@joker.front/core";  

// Define a data proxy  
let ob = observer({  
    userName: "Zhang San"  
});  

// Subscribe to data changes  
let watcher = new Watcher(ob, "userName", (newValue, oldValue) => {  
    console.log("Data has changed");  
});  

// Modify the value, triggering the subscribed callback  
ob.username = "Li Si";  
```  

We can customize a `Watcher` to subscribe to proxy data changes. If using a custom `Watcher`, ensure it is destroyed when no longer needed to avoid unnecessary resource consumption.  

In components, you can use the `$watch` function from the [Component API](/base/component-api) to implement data subscriptions. This approach eliminates the need to handle destruction manually, as it is automatically cleaned up when the component is destroyed. Alternatively, you can manually call `destroy()` to unsubscribe before the component is destroyed.  

### Watcher  

The `Watcher` class in Core provides reactive data subscriptions both inside and outside components, allowing developers to define custom subscription rules.  

Let's examine the different ways (overloads) to invoke `Watcher`:  

#### First Method  

```ts
new Watcher(  
    Proxy Object / Expression Function,  
    Property Name(s) [separated by ","],  
    Change Notification Function,  
    Force Execution (notify even if the value remains the same, default: false)  
);  

// Example:  
new Watcher(ob, 'userInfo.userName', (nv) => {}, false);  
new Watcher(() => ob, 'userInfo.userName', (nv) => {}, false);  
```  

#### Second Method (Recommended)  

```ts
new Watcher(Data Access Expression Function, Change Notification Function);  

// Example:  
new Watcher(  
    () => ob.userInfo.userName,  
    (nv) => {}  
);  

// To subscribe to multiple value changes:  
new Watcher(  
    () => [ob.userInfo.userName, ob.userInfo.age],  
    (nv) => {}  
);  
```  

Let's observe the behavior with an example:  

!!!demo1!!!  

> **Note:** When `forceCallBack` is `false` (default), if the expression returns an array/object, changes are only detected if the contents differ. Even if the reference changes but the contents remain identical, it **does not count as a change**, effectively reducing unnecessary notifications.  

### Properties/Methods  

Creating a `Watcher` instance provides a subscription object (the `$watch` function in components also returns a `Watcher` instance). We can perform advanced operations using this object:  

#### value  

The `value` property allows us to retrieve the current value of the expression immediately and keeps it synchronized upon changes:  

```ts
let watcher = new Watcher(  
    () => ob.userName,  
    () => {}  
);  

// Get the current value via `value`  
watcher.value;  
```  

#### destroy()  

Invoke `destroy()` to unsubscribe and release the subscription resources:  

```ts
let watcher = new Watcher(  
    () => ob.userName,  
    () => {}  
);  

// Destroy  
watcher.destroy();  
```  

#### isDestroy  

This property indicates whether the subscription has been destroyed:  

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