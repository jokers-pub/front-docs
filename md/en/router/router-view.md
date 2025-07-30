## router-view View Container

This chapter mainly introduces the core component `<router-view>` in Joker Router. As a view container, it provides a rendering container for page components.

### What is a View Container

We can split a page into multiple dynamically-rendered blocks and use the `view container <router-view>` to dynamically render the page components of these blocks.

A page can consist of multiple different parts, such as the `header`, `menu`, `content block`, etc. Each block can be a partial page and will update new page components as needed when the route changes.

![Layout](/router/layout.png)

### How to Use

We can add `<router-view>` to the page to create a dynamic view container and manage the rendering components of the view container through the Router's [configuration](/router/registry).

```html
<div>
    <router-view></router-view>
</div>
```

### Named View Containers

We can configure multiple view containers on a page. To clearly define the rendering components of different containers, we set the `name` property to specify the component that the view container needs to render.

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

Named view containers usually need to work in conjunction with the `components` field in the route configuration. When multiple view components are defined in the route settings, these components can be rendered in their respective view containers according to the route matching.

### Events [updated]

The view container provides an `updated` event, which is triggered and executed after the view component is loaded and inserted into the view container.

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

The `RouterViewUpdatedEventData` as the parameter type of the **updated** event includes:

| Attribute Name | Description                                                                                           | Type                                  |
| -------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------- |
| deep           | The current level of the view container. For details, refer to [Nested Routes](/router/nested-routes) | number                                |
| isLeaf         | Whether it is a leaf container. For details, refer to [Nested Routes](/router/nested-routes)          | boolean                               |
| keepAlive      | Whether to preserve the state                                                                         | boolean                               |
| component      | The component instance loaded in the current view container                                           | [Component](/base/component-property) |
| currentRoute   | The current route information                                                                         | RouteLocation                         |
| routeRecord    | The currently matched route record                                                                    | RouteRecord                           |

### Passing of Blocks to be Rendered

As a component, `<router-view>` also supports passing blocks to be rendered.

```html
<template>
    <router-view>
        <p>I am the template of the block to be rendered</p>
    </router-view>
</template>
```

As can be seen from the above example, we will pass the [section](/base/template-section) in `router-view` to the loaded component and let the rendering component perform the corresponding rendering.
