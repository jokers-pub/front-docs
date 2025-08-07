## router-view 视图容器

本章主要介绍 Joker Router 中的核心组件：`<router-view>`，它作为视图容器，提供页面组件的渲染容器。

### 什么是视图容器

我们可以将页面拆分为多个动态渲染区块，并通过`视图容器<router-view>`来动态渲染区块的页面组件。

一个页面中可以由多个不同的部分组成，例如：`头部`、`菜单`、`内容区块`等等，每个区块都可以是一个局部页面，并在路由变化时按需去更新新的页面组件。

![Layout](/router/layout.png)

### 如何使用

我们可以在页面中添加`<router-view>`来创建一个动态视图容器，并通过 Router 的[配置](/router/registry)来管理视图容器的渲染组件。

```html
<div>
    <router-view></router-view>
</div>
```

### 命名视图容器

我们可以在一个页面中配置多个视图容器，为了明确不同容器的渲染组件，我们通过配置`name`属性来设置该视图容器需要渲染的组件。

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

命名视图容器通常需要与路由配置中的`components`字段协同工作。当路由设置中定义了多个视图组件时，这些组件便可以在各自的视图容器中按路由匹配进行渲染。

### 事件 [updated]

视图容器提供`updated`事件，该事件在视图组件加载完成并装入视图容器后触发执行。

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

其中`RouterViewUpdatedEventData`作为**updated**事件的参数类型它包括：

| 属性名称     | 说明                                                          | 类型                                  |
| ------------ | ------------------------------------------------------------- | ------------------------------------- |
| deep         | 当前视图容器层级，详细可了解[嵌套路由](/router/nested-routes) | number                                |
| isLeaf       | 是否是叶子容器，详细可了解[嵌套路由](/router/nested-routes)   | boolean                               |
| keepAlive    | 是否保持状态                                                  | boolean                               |
| component    | 当前视图容器装载的组件实例                                    | [Component](/base/component-property) |
| currentRoute | 当前路由信息                                                  | RouteLocation                         |
| routeRecord  | 当前匹配的路由记录                                            | RouteRecord                           |

### 待渲染区块传递

`<router-view>`作为组件也支持待渲染区块传递。

```html
<template>
    <router-view>
        <p>我是待渲染区块模板</p>
    </router-view>
</template>
```

上面示例可以看出，我们会把`router-view`中的[section](/base/template-section)传递到装载组件中，交由渲染组件去执行相应的渲染。
