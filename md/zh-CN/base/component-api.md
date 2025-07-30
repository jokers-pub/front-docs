## 组件的方法

我们的组件开发都基于`@('@joker.front/core')`这个强大的库。它为开发者提供了一系列的工具和 API，包括生命周期钩子函数、API 函数和属性，这些都可以帮助我们更高效、更便捷地完成组件的开发。在这个章节中，我们将深入探讨一个组件类的组成，让您了解如何利用这个库来打造出一个功能丰富、性能优越的组件。

### 前提条件

在阅读该章节之前，你应该对这些内容有一个基本的了解：

-   [TypeScript 编程](https://www.typescriptlang.org/)

-   [Joker 生命周期](/base/component-lifecycle)

Joker Core 提供的内置函数都是以`$`开头，例如：this.$watch、$destroy 等，接下来我们一起了解一下 Joker Core 提供了哪些内置函数：

### 组件的装载（$mount）

该函数一般是提供外围程序去调用，用于挂载当前组件。

```ts
import MyComponent from "my-component.joker";

let myComponent = new MyComponent();
myComponent.$mounted(document.getElementById("app"));
```

通过下面的例子，来体验一下一个组件的装载。

!!!demo1!!!

| 参数 | 说明                                                    | 类型                    | 默认值 |
| ---- | ------------------------------------------------------- | ----------------------- | ------ |
| root | 要装载的容器，我们常用于将一个组件挂载到一个 dom 节点中 | Element/VNode.Component | -      |

> 可不传递 root，不传递 root 则不会触发组件的模板渲染，只作为一个附属功能存在，我们可以使用这种模式来做一些组件的功能混入。

### 组件销毁（$destroy）

通过主动调用一个组件实例的$destroy 方法，可实现组件的卸载。

```ts
import MyComponent from "my-component.joker";

let myComponent = new MyComponent();
myComponent.$mounted(document.getElementById("app"));

//卸载
myComponent.$destroy();
```

通过下面的例子来了解下 destroy：

!!!demo2!!!

针对已经保持状态的组件，调用销毁方法不会彻底销毁该组件，该组件会在后台保持数据状态，可通过传入参数 force:true，来彻底销毁该组件。

通过下面的例子来看一下销毁方法在保持状态的组件中是如何工作的。

!!!demo3!!!

> 关于保持数据状态的详细介绍后面有单独的章节进行讲解。

| 参数  | 说明           | 类型    | 默认值 |
| ----- | -------------- | ------- | ------ |
| force | 是否要强制销毁 | Boolean | -      |

### 数据观察（$watch）

通过$watch 方法可以实现对已劫持的属性进行值变更的观察，并在值变更后响应对应的函数。

```ts
import { Component } from "@joker.front/core";

export default class extends Component {
    model = {
        value: "v1"
    };

    mounted() {
        let [val, destroyWatch] = this.$watch(
            () => this.model.value,
            (nv, ov) => {
                //值变更了，值为nv，历史值为ov
            }
        );
    }
}
```

!!!demo4!!!

> 值的注意的是，观察的值一定是被数据劫持的属性（model 属性内的值会在组件装载前进行`observer`操作。），否则无法对其进行变更观察，针对数据劫持请看[这里](/base/observer)去详细了解。

| 参数          | 说明                                 | 类型                                                             | 默认值 |
| ------------- | ------------------------------------ | ---------------------------------------------------------------- | ------ |
| express       | 要观察的表达式                       | Function                                                         | -      |
| callback      | 变更后回调函数                       | (nv:any,ov:any)=>void ，会有两个参数，分别代表**新值**和**原值** | -      |
| forceCallBack | 是否强制回调（当值相同是否强制回调） | boolean(可选，默认 false)                                        |

### 节点观察（$watchNode）

通过节点观察，可以实现对虚拟节点变更的监听，其中包括：节点移除、新增、变更等。

在了解该方法时，建议先了解[什么是 VNode](/base/vnode)，虚拟节点是 DOM 和 Script 之间关联的桥梁，它作为实际 DOM 树的一个映射虚拟节点树，用于 DOM 和 Script 之间的数据通讯，并且 VNode 可实现渲染层的解耦，可替换成小程序渲染、移动端原生渲染（V8 内核通讯）。目前`Core`中默认提供了 H5-Render（H5-DOM 渲染，负责将虚拟 Node 渲染成 H5 标签节点）。

对虚拟 Node 有一个大概的了解后，就可以先继续学习该 API 了：

```ts
import { Component } from "@joker.front/core";

export default class extends Component {
    model = {
        value: "v1"
    };

    mounted() {
        this.$watchNode("节点ref", (node, type, property) => {
            //node 变更的节点
            //type 变更类型
            //property 如果是属性变更，属性名是什么
        });
    }
}
```

!!!demo5!!!

| 参数     | 说明               | 类型                                                                                                                                                                               | 默认值 |
| -------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| ref      | 需要观察节点的 ref | string                                                                                                                                                                             | -      |
| callback | 变更后回调函数     | (node:VNode.Node,type:"append" / "remove" / "update" / "after-enter" / "after-leave",property:string)=>void ，会有三个参数，分别代表**变更的节点**、**变更类型**和**变更的属性值** | -      |

### 获取节点（$getRef和$getRefs）

通过给标签配置`ref`属性，来给标签做标记，标记后的标签即可在 script 内通过 **$getRef** 或者 **$getRefs** 来获取。
该方法返回的是虚拟 Node，在了解该方法时，建议先了解[什么是 VNode](/base/vnode)。

```ts
//获取单个节点
this.$getRef<VNode.Element>("ref");

//获取多个节点
this.$getRefs("ref");
```

$getRef 会返回最多一个 VNode，如果遇到多个相同的 ref 时，只返回第一个。

$getRefs 会返回多个 VNode，会将当前组件内（不含子组件）ref 值相同的节点进行返回。

两个方法都支持 Typescript 的泛型（默认 VNode.Node），可指定返回节点的类型，方便后续的值操作。

!!!demo6!!!

| 参数 | 说明          | 类型   | 默认值 |
| ---- | ------------- | ------ | ------ |
| ref  | 节点的 ref 值 | string | -      |

> 当然我们也提供`$refs`属性，用来存放所有标记的节点，详细知识，请看[组件属性](/base/component-property)中的$refs 介绍。

### 事件（$on / $off / $trigger）

`$on`、`$off`和`$trigger`，是组件事件机制的核心方法，分别代表事件的注册、事件销毁和事件的触发。

其中**trigger**使用的比较多，一般用作组件对外的事件广播。

接下来我们一起看一下事件的用法：

```ts
//事件注册
this.$on("事件名称", (e: VNode.Event, param: any) => {
    //其中e代表事件处理对象，负责处理事件总线流转和数据传递
    //param 代表事件的附加参数
});

//事件卸载
this.$off("事件名称", 事件函数);

//事件触发，在事件截获转发时，可继续传递第三个参数，保持事件对象一致性传递
this.$trigger("事件名称", 事件参数, e?:VNode.Event);
```

案例展示：

!!!demo7!!!

> 当我们想要监听一个组件的所有事件触发时，我们也提供了`*`通配符，可以通过`$on('*',...)`的方式来监听该组件的所有事件处理，该通配符只适用于`$on`API 方法调用，不适用于 `template` 模板中的事件注册。

看一个复杂的使用例子：

```ts
this.childrenComponent.$on("*", (e: VNode.Event) => {
    if (e.eventName === "click") {
        //TODO:...
        return;
    }

    //其余事件不做处理，向上继续传递。
    this.$trigger(e.eventName, e.data, e);
});
```

#### VNode.Event 介绍

VNode.Event 作为 Joker 前端中事件处理对象，无论是通过 JS 主动响应的事件还是原生事件触发，都会将该类型作为第一个参数传递到$on 函数中。

其中该对象中具有一个`data`属性，代表事件传递的参数，可通过泛型来指定值类型，方便后续操作，默认为 undefined。

| 属性名称        | 说明                         | 类型                 |
| --------------- | ---------------------------- | -------------------- |
| eventName       | 事件名称                     | string               |
| event           | 原生事件对象，取决于运行平台 | any                  |
| target          | 响应该事件的虚拟节点         | VNode.Node/undefined |
| data            | 事件参数                     | <T>:any              |
| preventDefault  | 阻止默认事件                 | function             |
| stopPropagation | 阻止事件传播                 | function             |

标签或者组件的事件注册及触发

父组件

```html
<template>
    <button @click="handleClick('参数1', '参数2')">按钮</button>
    <MyComponent @click="handleMyComponentClick('参数1', '参数2')">按钮</MyComponent>
</template>
<script>
    import { Component, VNode } from "@joker.front/core";
    import { MessageBox } from "@joker.front/ui";
    import MyComponent from "./children1.joker";

    export default class extends Component {
        components = {
            MyComponent
        };
        handleMyComponentClick(e: VNode.Event<string>, param1: string, param2: string) {
            //这是事件传递的参数值
            e.data;
            //这是事件的扩展参数
            param1;
            param2;
        }

        handleClick(e: VNode.Event, param1: string, param2: string) {
            //这是事件的扩展参数
            param1;
            param2;
        }
    }
</script>
```

子组件

```html
<template>
    <button @click="handleClick">我是子组件按钮</button>
</template>
<script>
    import { Component } from "@joker.front/core";

    export default class extends Component {
        handleClick() {
            this.$trigger("click", "我是子组件传递的参数");
        }
    }
</script>
```

用实际的例子感受下：

!!!demo8!!!

在上述示例中，我们可以观察到`e.data`作为事件传递的一个参数，它在组件间传递时负责携带跨组件的数据。另一方面，在注册事件时通过函数传递的参数，例如 handleClick(param1,param2)中的`param1,param2`，这些参数作为事件处理函数的扩展参数，并不会随着事件的传播而传递。它们仅限于在当前组件内的事件处理函数中作为扩展参数使用，只会在该次事件响应时作为扩展参数从`e:VNode.Event`后延续传递。

通过调用 e.preventDefault()可实现阻止默认事件，一般用作原生事件的响应。不了解 preventDefault 点击[这里](https://www.w3school.com.cn/jsref/event_preventdefault.asp)去了解下。

```ts
handleClick(e:VNode.Event){
    e.preventDefault();
}
```

通过调用 e.stopPropagation()来实现阻止事件继续传递。不了解 stopPropagation 点击[这里](https://www.w3school.com.cn/htmldom/event_stoppropagation.asp)去了解下。

```ts
handleClick(e:VNode.Event){
    e.stopPropagation();
}
```

每一个 Joker 组件都默认提供了一些基础的事件，如有需要可以主动监听这些事件来处理特殊需求场景。

| 事件名称      | 说明             | 参数 |
| ------------- | ---------------- | ---- |
| created       | 组件装载之前触发 | -    |
| mounted       | 组件装载之后触发 | -    |
| sleeped       | 组件睡眠后触发   | -    |
| wakeup        | 组件被唤醒后触发 | -    |
| beforeDestroy | 组件销毁前触发   | -    |
| destroy       | 组件销毁后触发   | -    |

> 从上述默认事件中，我们可以发现这些事件与生命周期钩子是相对应的。生命周期钩子通常用于在当前组件内进行周期性扩展，而提供的这些周期性事件则主要用于在组件外部监听并跟踪组件的状态变化。

### 属性同步（$syncProp）

在学习该方法之前，请先了解下[组件属性](/base/component-property)中的`model`和`props`知识。

由于 props 只可以取值不可以设值，所以当遇到需要在内部流转状态时，必须使用 model 去创建属性，但是需要在 props 变更时同步到 model 中，所以在不使用`syncProp`方法时代码是这样的：

```ts
import { Component } from "@joker.front/core";

export default class extends Component<{
    money: number;
}> {
    model = {
        money: 0
    };

    created() {
        //首次值同步
        this.model.money = this.props.money;

        //监听变更后，同步到model中
        this.$watch(
            () => this.props.money,
            (nv) => {
                this.model.money = nv;
            }
        );
    }

    handleClick() {
        //模拟内部的值变更
        this.model.money = 300;
    }
}
```

可以看到，实现值的单向同步，代码还是比较复杂的，所以我们提供了$syncProp 方法来帮助开发人员快速实现一个单项的数据同步。

```ts
export default class extends Component<{
    money: number;
}> {
    model = {
        money: 0
    };

    created() {
        this.$syncProp("money");
    }

    handleClick() {
        //模拟内部的值变更
        this.model.money = 300;
    }
}
```

该方法有多个重载，可满足大多数场景的使用：

```ts
/**
 * 值单向同步 （全参数）
 * @param propKey 需要同步的props属性名
 * @param modelKey 需要落地同步的model属性名
 * @param convertVal 若props 和 model中同步的值类型不一致，可通过该方法进行转换
 */
this.$syncProp(propKey: keyof T, modelKey: string , convertVal?: (val: any) => any);

//该方法的其他重载
this.$syncProp(propKey: keyof T, convertVal?: (val: any) => any);

//例如
//若属性名不同，并且需要值转换
this.$syncProp('propsValue','modelValue',(val:string)=>{return parseInt(val);});

//若属性名相同，并且需要值转换
this.$syncProp('propsValue',(val:string)=>{return parseInt(val);});

//若属性名相同，值类型相同
this.$syncProp('propsValue');
```

### 节点动画（$nodeTransition）[高级 API]

在有些场景下，需要通过 js 来主动开始一个节点的动画，例如"淡隐淡出"，该方法可以帮助开发人员主动开启一个节点的动画。

```ts
this.$nodeTransition(
    //需要动画的节点或ref
    nodeOrRef: string | VNode.Node,
    //动画周期类型
    mode: "enter" | "leave",
    //动画名称，对应动画class name
    name?: string,
    //动画结束后回调函数
    callBack?: Function,
    //动画类型
    type?: "transition" | "animation")
```

看一个简单的例子，这里我们应用一个@('@joker.front/ui')提供的一个样式动画：

!!!demo9!!!

### 等待下次渲染

Joker 前端的渲染是即时的，当属性变更会立即在页面中进行更新渲染，但是当我们在使用异步组件时，就需要通过`$nextUpdatedRender`函数来监听组件是否完成整体渲染更新。

```ts
//1 用法一
this.$nextUpdatedRender(() => {
    //TODO: 完成了更新
});

//2 用法二
await this.$nextUpdatedRender();
//TODO: 完成了更新
```

### 渲染模板（$render）[高级 API]

在 Joker 中可以通过`<template>`标签或者`template`属性去创建视图模板，当然也可以通过调用$render 函数去渲染模板，我们允许在**过程**中动态变更模板。该 API 是高级用法。

```ts
/**
 * 渲染模板
 * @param asts 新的ast树
 * @param keepalive 渲染新模板时，是否要保留之前的存活组件（高级用法，请慎用）
 */
this.$render(asts:AST.Node[]|()=>AST.Node[],keepalive?:boolean)
```

其中 AST 相关内容，请点击[这里](/base/ast)去查看。

!!!demo10!!!

> 模板渲染也是有自己的生命周期的，每次新的渲染都会先执行原模板的销毁（包括节点数据、节点事件等数据的清理），再去依据当前组件模型去创建新的模板，关于模板请点击[这里](/base/ast)去查看。
