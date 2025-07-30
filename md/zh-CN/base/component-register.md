## 组件注册

该章节主要介绍如何去注册一个组件，包括私有组件和全局组件的注册机制。

### 私有组件注册

通过配置`component`属性来配置当前组件内的私有组件，组件的注册机制可查看[组件注册](/base/component-register)。

```html
<template>
    <MyComponent />
    <MyAsyncComponent />
</template>
<script>
    import { Component } from "@joker.front/core";
    import MyComponent from "./children.joker";
    export default class extends Component {
        component = {
            MyComponent,
            MyAsyncComponent: () => import("./async-children.joker")
        };
    }
</script>
```

!!!demo1!!!

组件的注册是支持异步的，可以使用`()=>import('component.joker')`的方式来进行组件的异步引用，异步引用组件不会随着父组件的初始化而被加载，直到该组件需要被渲染时才会进行加载，例如：

```html
<template>
    @if(false){
    <MyAsyncComponent />
    }
</template>
<script>
    import { Component } from "@joker.front/core";

    export default class extends Component {
        component = {
            MyAsyncComponent: () => import("./async-children.joker")
        };
    }
</script>
```

!!!demo2!!!

可以通过上面的代码和控制台输出（网络）可以看到，异步组件会在被要求加载时才会被加载。

### 全局组件注册（registerGlobalComponent）

Core 核心库中提供了`registerGlobalComponent` 函数用于注册全局组件，若注册为全局组件，即可在所有的组件内进行该组件的使用，避免重复注册。

```ts
import { registerGlobalComponent } from "@joker.front/core";
import MyComponent from "./components/my-component.joker";

//单个组件注册
registerGlobalComponent("my-componet", MyComponent);

//也支持多组件注册
registerGlobalComponent({
    "my-componet": MyComponent,
    "my-test-component": MyTestComponent,
    "my-async-component": () => import("./components/async-component.joker")
    //...
});
```

下面看一下全局组件的例子：

```ts
import { registerGlobalComponent } from "@joker.front/core";

//我们在main.ts（入口）文件中注册全局组件
registerGlobalComponent({
    DemoRow: DemoRow
});
```

!!!demo3!!!

全局组件注册，也同私有组件一样，支持异步组件的引入，异步组件不会随着项目启动而加载，直到它被渲染前才会被加载。

> 我们不限制**registerGlobalComponent**函数的使用位置，但是我们还是建议在入口文件中使用它，这样可以更清晰更快速的了解一个项目的全局组件有哪些。

### 查找全局组件（getGlobalComponent）

Core 核心中也提供了**getGlobalComponent**获取全局组件的函数，我们可以通过该方法能动态判断是否有你需要的全局组件

值的注意的是，该方法的返回类型有三种：

-   **undefined**（未找到）
-   **ComponentConstructor**（待初始化的组件类）
-   **ImportComponentConstructor**（异步组件加载方法）

```ts
getGlobalComponent("my-component");
```

### 内置全局组件（template）

我们内部提供了一个虚拟容器节点，该节点只作为一个容器，并展示容器内的内容，该组件本身不会输出任何元素(Element)。
我们可以使用这个组件来实现归组的功能，例如：

```html
<template>
    <ul>
        <li>我是固定列1</li>
        <li>我是固定列2</li>
        <template ref="test">
            <li>我是列3</li>
            <li>我是列4</li>
        </template>
    </ul>
</template>
```

!!!demo4!!!

### 内置全局组件（component）

内置 component 用于渲染动态组件。

!!!demo5!!!

你可以通过`name`的方式来指定当前组件的名称，这个值可以是当前组件内私有组件的 name，也可以是全局组件的 name，同时 name 的变更会触发组件的渲染，以便渲染新的组件。

你可以将该组件作为一个动态组件容器，它的参数传递、事件注册和其他组件一样，值得注意的是，它本身除了**keep-alive**、**name**、**transition-name**、**ref**属性外，他都会透传到你实际渲染的组件。事件的处理机制同理， 我们在该组件内监听渲染组件的`*`事件（可以查看$on API），然后将所有事件向上广播传递，本身不做事件处理和拦截。

当然除了使用**name**去渲染动态组件，我们也提供了`loadComponent` API，可以调用该方法实现更复杂的渲染机制。

```ts
import { Component, ComponentContainer } from "@joker.front/core";

export default class extends Component {
    testFunction() {
        //渲染组件
        this.$getRef<VNode.Component<ComponentContainer>>("test")?.component.loadComponent("name");
    }
}
```

由于它本身是一个动态组件，并且支持保持数据状态（keep-alive），所以我们也提供了`removeCache`API，来清除某一个渲染过组件的缓存。

```ts
import { Component, ComponentContainer } from "@joker.front/core";

export default class extends Component {
    testFunction() {
        //渲染组件
        this.$getRef<VNode.Component<ComponentContainer>>("test")?.component.removeCache("name");
    }
}
```
