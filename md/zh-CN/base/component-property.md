## 组件的属性

我们的组件开发都基于`@('@joker.front/core')`这个强大的库。它为开发者提供了一系列的工具和 API，包括生命周期钩子函数、API 函数和属性，这些都可以帮助我们更高效、更便捷地完成组件的开发。在这个章节中，我们将深入探讨一个组件类的组成，让您了解如何利用这个库来打造出一个功能丰富、性能优越的组件。

Joker 默认提供了一些默认属性和属性的规范标准，该章节主要介绍下这些属性，方便我们在开发过程中更好的使用他们。

### 组件参数（props / propsOption）

在父组件中可以传递参数到子组件，子组件通过 typescript 的泛型来为组件指定参数类型，并可以通过`propsOption`来为参数设置一些约束或默认值。

```ts
import { Component } from "@joker.front/core";

export default class extends Component<{
    message: string;
    checked: boolean;
    money: number;
}> {}
```

通过上面的代码示例可以看出，当前组件会接受到三个参数，并指定了三个参数的类型。

> 值的注意的是，Joker 为了最大限度保持灵活度，对组件的参数是弱约束，定义的泛型类型，只是作为组件内的快速提示存在的，不会做值的转换、非空判断等操作。

当然，如果你的组件有对参数的约束、默认值、类型的强制要求，我们也提供了`propsOption`来进行配置。

```ts
import { Component } from "@joker.front/core";

export default class extends Component<{
    message: string;
    age: number;
    money: number;
    zIndex: number;
}> {
    propsOption = {
        money: {
            //必须输入参数
            required: true,
            //类型
            type: [String, Number],
            //校验
            validate(val: any) {
                let value = parseInt(val);
                if (isNan(value)) {
                    console.error("money请输入类型");
                    return false;
                }
                return true;
            }
        },
        message: "我是默认提示",
        age: Boolean,
        zIndex: 1
    };
}
```

通过上面的例子可以看到 propsOption 支持丰富的用法，它的规则是：

1. 如果是 String | ArrayConstructor | Number | Object | Function | Boolean 或 Array<以上类型>，则代表约束该值的类型，并在取值时，按照默认的第一个类型尝试去转换，转换失败则报错。

2. 如果是对象，对象内包括`type`/`required`/`default`/`validate`任意一个属性，则按照全属性作为参数的约束。
   全类型参数说明（属性均为可选）：
   |属性名|说明|类型|
   |-|-|-|
   |type|值类型|String / Array/ Number / Object / Function / Boolean 或 配置多项[以上类型]|
   |required|是否为必输项|boolean|
   |default|默认值|any|
   |validate|值校验方法|(val:any)=>boolean|

3. 若不满足以上条件，则将该值作为参数的默认值，当参数为**undefined**时，则按照此默认值返回。

通过上面的内容可以了解到如何去定义当前组件的参数及参数的约束，接下来我们一起看一下如何读取参数。

```ts
let money = this.props.money;
```

我们定义的参数，可以通过`props`对象进行获取，值的注意的是，该属性为只读属性，它不允许重新定义或设置新值。

在处理参数传递时，我们通常依据元素标签来操作。为了维持命名的一致性和规范性，属性名称可能会采用`驼峰式命名`或使用`-`来分隔。为了更好地兼容多种参数命名标准，我们在读取参数时将采取以下策略：首先，直接使用原始的键名尝试获取参数；如果未能成功获取，那么我们将尝试**每个单词首字母大写**转换小写后进行分割，并用`-`将它们连接起来作为 key，再次尝试获取参数。这样的处理方式能够确保我们能够灵活地适应不同的命名规则。

例如：

```html
<my-component success-message="我是成功提示" errorMessage="我是错误提示" />
```

那在组件内可以这样取值，这些取值方式都是允许的。

```ts
this.props.successMessage;
this.props["success-message"];
this.props.errorMessage;
```

Joker 在内部对 boolean 做了进一步的优化，为了避免在标签内使用`checked="@('@true')"`这样多余的操作，当我们遇到一个属性被定义但是没有配置值（注意不是 undefined，而是没有`=`）,则默认作为 true 处理。例如：

```html
<my-component checked />
```

更多模板语法可通过阅读[模板](/base/template)来进行深度了解。

`props`的数据是响应式数据，当外部值变更后，也会进行同步通知：

!!!demo1!!!

子组件的代码：

```html
<template> 我是子组件，你当前输入的内容：@props.message </template>
<script>
    import { Component } from "@joker.front/core";

    export default class extends Component<{
        message: string
    }> {}
</script>
```

### 响应式数据（model）

Joker 内部提供了[observer](/base/observer)数据劫持的方法，但是为了方便开发人员快速的定义组件内的响应数据，我们默认提供了 model 属性，该属性会在装载开始之前被劫持，并提供数据响应的能力。

```ts
export default class extends Component {
    model = {
        value: ""
    };
}
```

当然， 你也可以使用`observer`方法来定义一个响应式数据。

```ts
export default class extends Component {
    list = observer({
        value: ""
    });

    created() {
        this.$watch(
            () => this.list,
            () => {
                //值变更了
            }
        );
    }
}
```

由于我们使用的是`typescript`标准，当 model 属性的类型过于复杂，我们可以采用`as`的方式来为某一个属性做类型指定。例如：

```ts
export default class extends Component {
    model: {
        value?: { key: string; value: number };
    } = {
        value: undefined
    };
}
//等同于👇👇👇 对于属性复杂或者多属性时更方便
export default class extends Component {
    model = {
        value: undefined as { key: string; value: number } | undefined,
        message: ""
    };
}
```

> 注意，我们建议 model 中只存放你需要响应式可观察的数据，对于临时的数据，可以直接作为属性配置在组件类内，以减少响应式的数据开销。

### 渲染模板（template）

我们除了借用`SFC`模式下的 template 标签去定义模板外，我们也可以通过 template 属性去定义模板，这样的好处是，我们可以通过 js 判断去创建更复杂的渲染模板。

```html
<script>
    import { Component, createElement, createText } from "@joker.front/core";
    export default class extends Component {
        template = function () {
            let children = [];
            if (__DEV__) {
                children.push(createText("我是通过createText创建的内容"));
            }
            return [createElement("div", undefined, children)];
        };
    }
</script>
```

!!!demo2!!!

### 私有组件（component）

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

!!!demo3!!!

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

!!!demo4!!!

可以通过上面的代码和控制台输出（网络）可以看到，异步组件会在被要求加载时才会被加载。

### 根节点（$root / $rootVNode）

在渲染时，每一个标签/组件/指令都是以树的形式存在的，组件也不例外，我们可以通过调用$root 和 $rootVNode 这两个属性来获取一个组件的装载容器/组件的 root 根节点。

那我们怎么区分$root 和 $rootVNode 呢？

- `$root`表示当前组件的装载容器，它是当容器被装载时（$mount）时作为参数传递并指定的，它可以是一个 HTML 的 Element，也可以是一个 VNode.Component。

- `$rootVNode`作为当前组件的顶级节点，它的类型一定是 VNode.Root，由于我们的渲染模板是不限制顶级标签个数的，所以必须由一个 VNode.Root 进行包裹，通过这个属性我们就提供向下查找节点等等的操作了。该属性的值会在模板渲染时才会创建，所以在`created`生命周期内无法获取到该属性的值。

例如，我们要获取当前组件所有 Element 节点

```html
<template>
    <div>1</div>
    <div>2</div>
    <div>3</div>
</template>

<script>
    //...
    //获取所有element节点
    this.$rootVNode?.find((n) => n instanceof VNode.Element);

    //向上找，找到最近的一个element节点
    this.$rootVNode?.closest((n) => n instanceof VNode.Element);

    //...
</script>
```

其中 VNode.Root 相关知识，可以点击[虚拟节点](/base/vnode)去了解。

### 所有标记节点（$refs）

该属性存放所有已经标记的节点，该属性是一个只读属性，当节点被新增或销毁时，该属性的值也会响应的同步（值同步，非响应式数据，若想做观察建议使用$watchNode API）。

```ts
let count = this.$refs.refName?.count;
```

当然你也可以调用`$getRef`和`$getRefs`方法来查找标记节点，这两个方法可以使用 typescript 的泛型类指定输出类型，更方便操作。[组件内置方法](/base/component-api)

### 是否保持状态（isKeepAlive）

通过该属性可以判断组件是否要求保持状态，要求保持状态的组件，在`$destroy`时会只销毁挂载元素节点，而不是销毁整个组件实例，详细可以去[组件生命周期](/base/component-lifecycle)中了解。

组件调用，并配置 keep-alive：

```html
<template>
    <MyComponent keep-alive />
</template>
```

子组件中可通过**isKeepAlive**来判断本次组件渲染是否要求保持状态。

```ts
export class extends Component {
    created() {
        if (this.isKeepAlive) {
            //TODO:...
        }
    }
}
```

### 是否已睡眠（isSleeped）

当组件要求保持状态时，在`$destroy`时会只销毁挂载元素节点，而不是销毁整个组件实例，详细可以去[组件生命周期](/base/component-lifecycle)中了解。
我们可以通过这个属性来判断当前组件的状态，例如：

```ts
export class extends Component {
    //定时任务触发函数
    testMethod() {
        //当组件睡眠时忽略定时执行。
        if (this.isSleeped) return;

        MessageBox.alert("定时器被触发。");
    }
}
```

### 渲染区块（$sections）

该属性为只读属性，代表当前组件内传入的待渲染区块，使用方式可查看[区块渲染](/base/template-section)。

```ts
class extends Component {
    myFunction() {
        if (this.$sections.top) {
            //传入了top区块模板
        } else {
            //没有传入top区块模板
        }
    }
}
```

### 监听者 ($listeners)

该属性为只读属性，代表当前组件所有事件监听者，如果你想判断组件是否监听了某个事件可以使用该属性进行判断。

```ts
class extends Component {
    myFunction() {
        if (this.$listeners.click) {
            //外部监听了click事件
        } else {
            //未监听click事件
        }
    }
}

```

该属性类型为对象类型，其中`key`代表区块名称，`value`代表待渲染区块的对象数据，它的详细类型如下(SectionType)：

| 属性名 | 说明                                                                                                     | 类型           |
| ------ | -------------------------------------------------------------------------------------------------------- | -------------- |
| asts   | AST 树，可查看[AST](/base/ast)进行了解                                                                   | AST.Node[]     |
| ob     | 渲染该模板时所需的数据对象（ob）                                                                         | Object         |
| parser | 渲染该模板时所在的 parser 解析对象                                                                       | ParserTemplate |
| params | 参数，可参考[区块渲染](/base/template-section)中的区块参数章节，该属性**不代表参数值**，而是**参数名称** | string[]       |

> 该属性为只读属性，不建议修改该属性的值，属性值由 Core 内部生成。
