## Parameter Passing  

During route navigation, there are multiple ways to pass parameters. This section mainly introduces these parameter-passing methods and their usage scenarios.  

### URL Parameter Passing  

The types of parameter passing vary depending on the **History Mode** used. They include the following methods:  

- **URL Query**: For example, `example.html?param=1&name=zohar`.  
- **Path Variable Matching**: Based on the **path** variable configuration, parameters are parsed at runtime and stored in the current route information.  
- **Router Props**: Parameters can be configured when registering a route and passed to the page component instance when the route loads.  
- **Navigation Parameter Passing (Name Mode)**: When navigating using methods like **push** or **replace**, parameters can be passed via `params` in name-based navigation mode.  

> Note: In **HTML History** mode, since route matching no longer relies on **hash**, the `Hash` method can also be used to pass parameters.  

Next, we will introduce the usage and scenarios of these parameter-passing methods in detail.  

### URL Query  

The **URL Query** mode allows parameters to be defined using `?`. However, this method may cause page refreshes. It is typically used in multi-page applications or scenarios like shareable pages.  

#### Passing Parameters  

Using a link:  

```html  
<a href="/index.html?user=zohar&age=30">DEMO</a>  
```  

Using method-based navigation:  

```ts  
push({  
    path: "user/info",  
    query: {  
        user: "zohar",  
        age: 30  
    }  
});  
```  

#### Retrieving Parameters  

Parameters can be retrieved using the `window.location.search` property in JavaScript. Alternatively, they can be obtained via `router.route.value.query`. Further details about `router.route` are covered in the [Route Information](/router/route) section.  

```ts  
import { router } from "@joker.front/router";  

// Get query parameters  
router.route.value.query;  
```  

### Path Variable Matching [path]  

Before understanding path variable matching, please review the `path` attribute rules in [Route Registration](/router/registry). This section focuses on how to use **path** rules to pass parameters.  

#### Passing Parameters  

Example of a dynamic parameterized `path`:  

```ts  
new Router({  
    routes: [  
        {  
            path: "/user/:userName/:userAge"  
        }  
    ]  
});  
```  

#### Retrieving Parameters  

When accessing the route `#/user/zohar/30`, parameters can be retrieved via `router.route.value.params`. More details about `router.route` are covered in the [Route Information](/router/route) section.  

```ts  
import { router } from "@joker.front/router";  

// Get route parameters  
router.route.value.params;  

/**  
 * ====> Output:  
 * {  
 *     userName: 'zohar',  
 *     userAge: '30'  
 * }  
 */  
```  

Note: Since parameters are parsed from the URL (a string), all parameter types will be `string`.  

### Router Props [Component Parameter Passing]  

The **Router Props** method differs from others as it passes parameters as `props` to the target component.  

#### Passing Parameters  

```ts  
new Router({  
    routes: [  
        {  
            path: "/user/info",  
            component: userComponent,  
            props: {  
                userName: "zohar",  
                userAge: 30  
            }  
        }  
    ]  
});  
```  

#### Retrieving Parameters  

Parameters can be retrieved via props in the rendered component **userComponent**.  

```html  
<template>  
    <ul>  
        <li>Name: @props.userName</li>  
        <li>Age: @props.userAge</li>  
    </ul>  
</template>  

<script>  
    import { Component } from "@joker.front/core";  

    export class extends Component<{ userName: string, userAge: number }> {  
        //...  
    }  
</script>  
```  

> This method does not expose parameters in the **URL**, allowing them to be used as internal logic parameters. For example, when two routes point to the same view component, `props` can provide different parameters to the same component for distinct logic handling.  

### Navigation Parameter Passing (Name Mode)  

This method uses the **name** mode of the router to pass parameters, working similarly to dynamic **path** parameters.  

#### Passing Parameters  

```ts  
new Router({  
    routes: [  
        {  
            name: "userInfo",  
            path: "/user/:userName/:userAge",  
            //...  
        }  
    ]  
});  
```  

When navigating using `push`:  

```ts  
push({  
    name: "userInfo",  
    params: {  
        userName: "zohar",  
        userAge: 30  
    }  
});  
```  

#### Retrieving Parameters  

When accessing `#/user/zohar/30`, parameters can be retrieved via `router.route.value.params`. More details about `router.route` are covered in the [Route Information](/router/route) section.  

```ts  
import { router } from "@joker.front/router";  

// Get route parameters  
router.route.value.params;  

/**  
 * ====> Output:  
 * {  
 *     userName: 'zohar',  
 *     userAge: '30'  
 * }  
 */  
```  

**Important Note:**  
- If a route has dynamic parameters in its `path` and a `name` property, Joker Router attempts to **reverse-translate** the passed parameters into a `string` based on the `path` configuration, updating the browser URL accordingly.  
- If parameters do not match or no dynamic parameters exist, navigation uses the converted path.  

Example:  

```ts  
new Router({  
    routes: [  
        {  
            name: "userInfo",  
            path: "/user/:userName/:userAge?",  
            //...  
        },  
        {  
            name: "userInfo2",  
            path: "/user",  
            //...  
        }  
    ]  
});  

push({  
    name: "userInfo",  
    params: {  
        userName: "zohar",  
        userAge: 30  
    }  
});  
// URL becomes ==> #/user/zohar/30  

push({  
    name: "userInfo",  
    params: {  
        userName: "zohar"  
    }  
});  
// URL becomes ==> #/user/zohar  

push({  
    name: "userInfo2",  
    params: {  
        userName: "zohar",  
        userAge: 30  
    }  
});  
// URL remains ==> #/user (parameters passed implicitly)  
```  

### Meta [Route Metadata]  

Static values can be configured in a route's `meta` property.  

#### Passing Parameters  

```ts  
new Router({  
    routes: [  
        {  
            path: "/user/userList",  
            meta: {  
                env: "dev"  
            }  
        }  
    ]  
});  
```  

#### Retrieving Parameters  

Parameters can be retrieved via `router.route.value.meta`. More details about `router.route` are covered in the [Route Information](/router/route) section.  

```ts  
import { router } from "@joker.front/router";  

// Get meta parameters  
router.route.value.meta;  

/**  
 * ====> Output:  
 * {  
 *     env: 'dev'  
 * }  
 */  
```