## Routing Events/States  

This chapter primarily discusses the events involved in routing navigation and their applications, leveraging these events enables the implementation of various complex functionalities and optimizations.  

### isReady [Routing Initialization Complete]  

During routing initialization, `Joker Core` performs view initialization based on the current address and completes the initial routing load.  

The `isReady` method not only indicates the completion of a class instantiation but also signifies the success or failure of an initial routing load. Only after the initial routing load is complete can the page routing be considered ready.  

```ts
import { Router } from "@joker.front/router";  

let appRouter = new Router({  
    //...  
});  

appRouter.isReady().then(() => {  
    //TODO:  
});  
```  

The `isReady` function returns a **Promise** object, allowing us to listen for the initial successful routing load via the `then` method and handle the initial routing load failure using the `catch` method.  

### errorCallbacks [Error Handling]  

You can use the `errorCallbacks` collection to monitor global routing exceptions from anywhere.  

```ts
import { Router } from "@joker.front/router";  

let appRouter = new Router({  
    //...  
});  

appRouter.errorCallbacks.add((err, to, from) => {  
    //err: Error data  
    //to: Target address  
    //from: Source address  
});  
```  

The `err` parameter may include not only native error types but also the internal `NavigationError` error type, which contains the following properties:  

| Property | Description                  | Type                                           |  
| -------- | ---------------------------- | ---------------------------------------------- |  
| type     | Error type                   | NavigationErrorTypes (introducted later)       |  
| from     | Source address               | RouteLocation                                  |  
| to       | Target address               | RouteLocationRaw                               |  

The `NavigationErrorTypes` enumeration includes:  

```ts
export const enum NavigationErrorTypes {  
    /** Redirect **/  
    REDIRECT,  
    /** Aborted */  
    ABORTED,  
    /** Cancelled */  
    CANCELLED,  
    /** Multiple matches, no explicit target */  
    SAME,  
    /** No matching route record found */  
    MATCHER_NOT_FOUND = 4  
}  
```  

You can use the `isNavigationError` function provided by Joker Router to determine if the current error object is of type `NavigationError`.  

```ts
import { isNavigationError } from "@joker.front/router";  

isNavigationError(err); //====> true/false  
```  

### beforeRouteCallbacks [Before Navigation]  

You can add listener functions to `beforeRouteCallbacks` to implement aspect-oriented event monitoring before routing navigation. This allows you to perform custom operations such as user permission validation, logging, etc., before navigation occurs. This method provides greater flexibility in controlling the navigation process while optimizing application performance and user experience.  

```ts
import { Router } from "@joker.front/router";  

let appRouter = new Router({  
    //...  
});  

appRouter.beforeRouteCallbacks.add((to, from, next) => {  
    //to: Target address  
    //from: Source address  
    //next: Proceed to the next step  
});  
```  

For the event type `NavigationCallback`, refer to the summary at the end of this chapter.  

### afterRouteCallbacks [After Navigation]  

`afterRouteCallbacks` serves as a post-navigation HOOK, with a usage pattern similar to `beforeRouteCallbacks`, except it lacks the **next**/**return** flow-control mechanism.  

```ts
import { Router } from "@joker.front/router";  

let appRouter = new Router({  
    //...  
});  

appRouter.beforeRouteCallbacks.add((to, from, err) => {  
    //to: Target address  
    //from: Source address  
    //err: Error details (see error type explanation in `errorCallbacks`)  
});  
```  

> It should be noted that `afterRouteCallbacks` reflects the state of routing navigation, not the completion state of page loading. To monitor the loading completion state of the **view container**, use the **updated** event in [router-view](/router/router-view).  

### beforeEnter / beforeLeave  

`beforeEnter` and `beforeLeave` are lifecycle hooks in Joker Router, specific to route record configuration properties. Unlike global event listeners, these hooks allow for aspect-oriented event management at the individual route level. By configuring these lifecycle hooks for specific routes, we gain finer-grained control over navigation entry and exit behaviors.  

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

For the event type `NavigationCallback`, refer to the summary at the end of this chapter.  

### NavigationCallback [Event Handling Type]  

As an event handling type, `NavigationCallback` adheres to a standardized specification, whether used in global events or route-specific lifecycle events.  

```ts
export type NavigationCallback = (  
    to: RouteLocation,  
    from: RouteLocation,  
    next: NavigationNextCallback  
) => Awaitable<NavigationCallbackReturn>;  

export type NavigationCallbackReturn = Error | RouteLocationRaw | boolean | undefined | void;  
```  

This type returns a `Promise` to enable asynchronous processing.  

Parameter descriptions:  

| Parameter | Description         | Type          |  
| --------- | ------------------- | ------------- |  
| to        | Target address      | RouteLocation |  
| from      | Source address      | RouteLocation |  
| next      | Next step (optional)| Function      |  

Since multiple aspect-oriented events can be registered with `beforeRouteCallbacks`, we must control their execution order and flow. This can be achieved via method return values or the `next` function to determine whether to proceed. Below is a detailed explanation:  

1. **First Approach: Control flow via method return values**  
   This approach does not require invoking the third parameter, `next`.  

```ts
appRouter.beforeRouteCallbacks.add((to, from) => {  
    //return false;  
    //return new Error('Custom error')  
    //return 'Redirect address';  
    //return {path: 'Redirect address'}  
    //return true/undefined/... (proceed to next HOOK)  
});  
```  

Return type descriptions:  

| Type        | Description                                                                                                        |  
| ----------- | ----------------------------------------------------------------------------------------------------------------- |  
| false       | Terminates the current navigation and triggers a `NavigationErrorTypes.ABORTED` error                              |  
| Error       | Terminates the current navigation and triggers the Error event                                                    |  
| string      | Redirects to the specified address and triggers a `NavigationErrorTypes.REDIRECT` error                           |  
| object      | Redirects to the specified address (must conform to [RouteLocationRaw](/router/change)) and triggers a `NavigationErrorTypes.REDIRECT` error |  
| Other       | Proceeds to the next HOOK                                                                                         |  

2. **Second Approach: Control flow via the `next` function**  

```ts
appRouter.beforeRouteCallbacks.add((to, from, next) => {  
    //next(false);  
    //next(new Error('Custom error'))  
    //next('Redirect address');  
    //next({path: 'Redirect address'})  
    //next(true/undefined/...) (proceed to next HOOK)  
});  
```  

It is recommended to avoid including additional business logic after executing the `next` method to maintain clarity and focus.  

> From the above two flow-control methods, we see that `beforeRouteCallbacks` consists of multiple processing HOOKs executed sequentially. Navigation proceeds only after all HOOKs complete (without termination/redirection).  

> The use of `async/await` syntax within methods is supported for handling `Promise`-based asynchronous logic.