## router-view View Container

This chapter introduces the core component in Joker Router: `<router-view>`, which serves as the view container providing the rendering space for page components.

### What is a View Container  

We can split a page into multiple dynamically rendered blocks and use the `<router-view>` view container to dynamically render the components for each block.  

A page can consist of different sections, such as: `header`, `menu`, `content area`, etc. Each section can be a partial page that updates its component as needed when routing changes.  

![Layout](/router/layout.png)  

### How to Use  

We can add a `<router-view>` in a page to create a dynamic view container, and manage the rendered components of the view container via the Router's [configuration](/router/registry).  

```html
<div>  
    <router-view></router-view>  
</div>  
```  

### Named View Containers  

A page can have multiple view containers. To specify which component should be rendered in which container, we use the `name` attribute to associate the view container with its corresponding component.  

```html
<div>  
    <div class="top">  
        <router-view name="top"></router-view>  
    </div>  
    <div class="content">  
        <router-view name="content"></router-view>  
    </div>  
    <div class="bottom">  
        <router-view name="bottom"></router-view>  
    </div>  
</div>  
```  

Named view containers typically work in conjunction with the `components` field in the route configuration. When multiple view components are defined in the routing settings, these components can be rendered in their respective view containers based on route matching.  

### Events [updated]  

The view container provides an `updated` event, which is triggered after the view component has finished loading and is mounted into the view container.  

```html
<template>  
    <router-view @updated="handleUpdated"></router-view>  
</template>  

<script>  
    import {Component} from "@joker.front/core";  
    import {RouterViewUpdatedEventData} from "@joker.front/router";  

    export class extends Component{  
        handleUpdated(e:VNode.Event<RouterViewUpdatedEventData>){  
            //TODO: e.data  
        }  
    }  
</script>  
```  

Here, `RouterViewUpdatedEventData` serves as the parameter type for the **updated** event, which includes:  

| Property     | Description                                                                 | Type                                  |  
| ------------ | -------------------------------------------------------------------------- | ------------------------------------- |  
| deep         | The current view container hierarchy (see [Nested Routes](/router/nested-routes)) | number                                |  
| isLeaf       | Whether it's a leaf container (see [Nested Routes](/router/nested-routes))  | boolean                               |  
| keepAlive    | Whether to maintain state                                                  | boolean                               |  
| component    | The currently mounted component instance                                   | [Component](/base/component-property) |  
| currentRoute | Current route information                                                  | RouteLocation                         |  
| routeRecord  | Matched route record                                                       | RouteRecord                           |  

### Slot Rendering  

`<router-view>` as a component also supports slot content passing.  

```html
<template>  
    <router-view>  
        <p>I am the slot template to be rendered</p>  
    </router-view>  
</template>  
```  

The example above shows that the [section](/base/template-section) inside `router-view` will be passed to the mounted component, which then handles the corresponding rendering logic.