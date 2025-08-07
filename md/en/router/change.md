## Route Navigation  

This section mainly introduces how to perform route navigation and pass route parameters.  

### Native Navigation  

We can use the **href** attribute of the `<a>` tag to achieve direct route navigation. Taking `Hash` mode as an example:  

!!!demo1!!!  

### RouteLocationRaw [Type]  

In addition to native link navigation, we also provide methods like `push` and `replace` for programmatic navigation. These JavaScript-based navigation methods require passing a `RouteLocationRaw` type parameter as the target information for navigation. First, let's clarify the property specifications of this type.  

```ts  
type RouteLocationRaw = string | RouteLocationPathRaw | RouteLocationNameRaw;  
```  

Next, we'll use the `push` method as an example to illustrate the usage of this parameter.  

1. **String**  

We can directly pass a string representing the target address. In `Hash` mode, the `#` symbol can be omitted.  

```ts  
push("router/init");  
```  

2. **RouteLocationPathRaw [Path Mode]**  

Navigation in `path` mode supports various functional configurations.  

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

The complete properties of this type:  

| Property  | Description                                                  | Type         |  
| --------- | ------------------------------------------------------------ | ------------ |  
| path      | Target navigation address                                    | string       |  
| replace   | Whether to skip recording this route in history              | boolean      |  
| force     | Force navigation, usually used for refreshing the same address | boolean      |  
| refresh   | Refresh cache—useful when pages have `keepalive` enabled     | boolean      |  
| state     | Route state data                                             | HistoryState |  
| hash      | Used for `HTML History Mode` to configure hash parameters    | string       |  
| query     | URL Query parameters                                         | object       |  

3. **RouteLocationNameRaw [Name Mode]**  

Navigation in `name` mode supports various functional configurations. For details about the `name` attribute, refer to the [Route Registration](/router/registry) section.  

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

The complete properties of this type:  

| Property  | Description                                                  | Type         |  
| --------- | ------------------------------------------------------------ | ------------ |  
| name      | Target route name (named route)                              | string       |  
| params    | Route parameters                                             | object       |  
| replace   | Whether to skip recording this route in history              | boolean      |  
| force     | Force navigation, usually used for refreshing the same address | boolean      |  
| refresh   | Refresh cache—useful when pages have `keepalive` enabled     | boolean      |  
| state     | Route state data                                             | HistoryState |  
| hash      | Used for `HTML History Mode` to configure hash parameters    | string       |  
| query     | URL Query parameters                                         | object       |  

> Note: Only the `name` mode **allows** passing `params`. In `path` mode, `params` are resolved based on the dynamic parameters in the current **path**.  

### push  

Navigates to a specified address. Internally, it uses `history.pushState` to efficiently update the URL.  

!!!demo2!!!  

The `push` method accepts one parameter of type `RouteLocationRaw`.  

### replace  

Similar to `push`, it uses `history.replaceState` to update the browser URL. However, it does not create a new history entry; instead, it replaces the current entry. This means that when users click the back button, they won't return to the previous state but will instead go back to the initial state.  

!!!demo3!!!  

The `replace` method disregards the current address in history. It accepts one parameter of type `RouteLocationRaw`.  

### go  

A navigation method that supports forward and backward jumps.  

```ts  
import { router } from "@joker.front/router";  

router.go(1);   // Forward  

router.go(-1);  // Backward  
```  

It accepts an integer parameter—positive for forward navigation, negative for backward navigation.  

### back  

Navigates back to the previous page.  

```ts  
import { router } from "@joker.front/router";  

router.back();  
```  

### forward  

Navigates forward, but only if there is forward history available.  

```ts  
import { router } from "@joker.front/router";  

router.forward();  
```