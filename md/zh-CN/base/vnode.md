## VNode 虚拟节点

该章节主要介绍虚拟节点，它在 Core 中是非常重要的，我们在实际的逻辑开发中会经常使用它。

> 在阅读此章节前，请先了解[AST](/base/ast)、以及[渲染](/base/render)相关内容。

### 概述

虚拟节点是根据抽象语法树（AST）编译生成的，它集合了当前组件对象，并承载了组件间的关联关系以及节点的数据存储功能。它不仅映射了组件的语法结构，还实现了数据的封装和管理，为整个系统的运行提供了高效和灵活的数据支持。

![VNode](/base/render.png)

它与 AST 不同，`AST.Node[]`代表的是开发态的模版结构化数据，而`VNode.Node`代表实际待渲染的结构化数据。

例如**for**循环:

```xml
@for(let item in 10){
    @item
}
```

上述代码在 AST 层面只包含了两个节点：一个`for循环`指令，以及它的一个子集。这是因为 AST 只是作为待编译的抽象语法，而非实际渲染结果。
当上述代码在页面中被渲染后，它将被编译为：

```
├── for 循环
│   ├── 文本节点 1
│   ├── ...
│   └── 文本节点 10
```

值的注意的是，VNode.Node[]是一个全量的结构化数据，无论该节点是否要被渲染，都会以节点的方式存在于虚拟结构树中。**虚拟节点数据都是由 Core 核心来生成的，不建议对其进行修改。**

VNode.Node 作为虚拟节点的基础类型，它衍生出很多具有功能意义的虚拟节点，包括：`VNode.Text`、`VNode.Element`等等。

VNode.Node 作为基础类型它本身具有以下属性：

| 参数名称 | 说明                                                                                       | 类型                 | 默认值 |
| -------- | ------------------------------------------------------------------------------------------ | -------------------- | ------ |
| static   | 是否是静态节点，用于区分动态指令及组件，方便快速更新和渲染                                 | boolean              | -      |
| output   | 输出，对应[Render](/base/render)渲染，不同平台的产出物不同，在 HTML 中，输出的即`DOM Node` | object               | -      |
| children | 子集                                                                                       | VNode.Node[]         | -      |
| parent   | 父级                                                                                       | VNode.Node/undefined | -      |
| sleep    | 当前节点是否睡眠                                                                           | boolean              | false  |
| prev     | 前一个节点                                                                                 | VNode.Node/undefined | -      |
| next     | 后一个节点                                                                                 | VNode.Node/undefined | -      |

每个节点除了预设的属性之外，还提供了一系列便于开发人员使用的 API 方法。

#### closest

该函数可以实现从当前节点开始向上查找临近符合要求的父级元素。

```ts
node.closest<VNode.Element>((node) => {
    return node instanceof VNode.Element;
}, true);
```

-   第一个参数为查询逻辑方法，在查找时会逐级将父级传入到该函数做判断，当返回**true**时，表示该节点为目标节点。
-   第二个参数为（breakWhenVRoot），用于限制查找范围，当遇到 root 节点时不再向上查找，默认为**false**

#### find

通过该方法可以实现查找符合的子集元素，该方法返回全部符合的子集（VNode.Node[]）。

```ts
node.find((node) => {
    return node instanceof VNode.Element;
});
```

#### contains

通过该方法可判断当前组件内是否包含指定的节点，该方法返回**boolean**。

```ts
node.contains((node) => {
    return node instanceof VNode.Element;
});
```

> VNode.Node 作为实体类在渲染时通过初始化（new）创建而来，我们可以使用`instanceof`来判断节点的类型。

### VNode.Root

`VNode.Root`代表一个组件的根节点，它是该组件所有节点的顶级父节点。每个组件的首个节点必定是`VNode.Root`类型的实例。

| 属性名    | 说明     | 类型         |
| --------- | -------- | ------------ |
| childrens | 子集     | VNode.Node[] |
| component | 组件实例 | IComponent   |

### VNode.Text

`VNode.Text`表示一个文本节点。

| 属性名 | 说明     | 类型   |
| ------ | -------- | ------ |
| text   | 文本内容 | string |

### VNode.Html

`VNode.Html`作为 HTML 节点，内容区块会采用 HTML 去渲染。

| 属性名 | 说明      | 类型   |
| ------ | --------- | ------ |
| html   | HTML 内容 | string |

### VNode.Comment

`VNode.Comment`作为注释节点，在渲染时会输出注释内容。

| 属性名 | 说明     | 类型   |
| ------ | -------- | ------ |
| text   | 注释内容 | string |

### VNode.Element

`VNode.Element`为通用标签节点。非 Component 组件，都将按照`VNode.Element`节点输出。

| 属性名     | 说明     | 类型                                                                                                      |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------- |
| attributes | 标签属性 | Record<string, any>                                                                                       |
| events     | 节点事件 | Array<[string, { modifiers?: string[]; callBack: EventCallBack }]> `EventCallBack`详见**VNode.Event**小结 |
| tagName    | 标签名称 | string                                                                                                    |
| childrens  | 子集     | VNode.Node[]                                                                                              |

### VNode.Component

`VNode.Component`为组件节点，用于提供组件数据处理及提供组件的装载容器。

| 属性名       | 说明                                                                                     | 类型                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| name         | 组件名称                                                                                 | string/undefined(可能是动态组件)                                                                          |
| component    | 组件实例对象                                                                             | Component                                                                                                 |
| events       | 组件事件                                                                                 | Array<[string, { modifiers?: string[]; callBack: EventCallBack }]> `EventCallBack`详见**VNode.Event**小结 |
| propValues   | 组件参数                                                                                 | Record<string, any>                                                                                       |
| keepalive    | 该组件是否要求保持状态，对应[模版内置属性](/base/template-property)中的**keep-alve**属性 | boolean                                                                                                   |
| firstElement | 组件内第一个 VNode.Element 节点                                                          | VNode.Element/undefined                                                                                   |
| childrens    | 子集                                                                                     | VNode.Node[]                                                                                              |

我们通常会在组件开发过程借助该类型实现复杂的需求，例如：

```ts
class extends Component{
    get parentComponent(){
        this.$rootVNode.closest((n)=>{
            return n instanceof VNode.Component && n.component.name='my-component-id';
        })?.component;
    }

    test(){
        //调用父组件API
        this.parentComponent?.testFunction();
    }
}
```

> `VNode.Component`的**output**属性在不同 Render 平台下输出的内容是不一样的，例如在 HTML-Render 中，该节点被渲染为：`document.createTextNode("")`一个空字符节点，用于记录节点位置。

### VNode.Condition

`VNode.Condition`表示一个条件节点，它用作实现 template 模版中的`if`/`elseif`/`else`指令。

| 属性名    | 说明                                                                                                                                                            | 类型                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| cmdName   | 指令类别                                                                                                                                                        | `if`/`elseif`/`else` |
| result    | 节点条件计算结果（非有效，为了避免无效计算，当存在**if-else**多级条件判断时，前置条件若为 true，则后续条件则不主动刷新值，直到前置判断为 false 时才会被计算。） | boolean              |
| isShow    | 子集是否被渲染，该值可代表真实**渲染结果**，而非**计算结果**                                                                                                    | boolean              |
| childrens | 子集                                                                                                                                                            | VNode.Node[]         |

### VNode.List / VNode.ListItem

`VNode.List`为列表渲染节点，用于处理列表循环数据，并提供列表项渲染容器。

| 属性名    | 说明 | 类型           |
| --------- | ---- | -------------- |
| childrens | 子集 | VNode.ListItem |

`VNode.ListItem`为列表**项**渲染节点，用于提供内容节点的渲染容器。

| 属性名    | 说明                                                            | 类型         |
| --------- | --------------------------------------------------------------- | ------------ |
| ob        | 当前项的渲染数据对象，包括循环指令产配置的`indexKey`和`itemKey` | Component    |
| childrens | 子集                                                            | VNode.Node[] |

### VNode.RenderSection

`VNode.RenderSection`为区块渲染节点，用于渲染当前组件中的**待渲染模版**。

| 属性名  | 说明         | 类型                    |
| ------- | ------------ | ----------------------- |
| id      | 区块名称     | string（默认：unknown） |
| params  | 区块参数     | any[]                   |
| section | 区块渲染对象 | SectionType             |

其中`SectionType`类型包括：

| 属性名 | 说明                                                                                                     | 类型           |
| ------ | -------------------------------------------------------------------------------------------------------- | -------------- |
| asts   | AST 树，可查看[AST](/base/ast)进行了解                                                                   | AST.Node[]     |
| ob     | 渲染该模板时所需的数据对象（ob）                                                                         | Object         |
| parser | 渲染该模板时所在的 parser 解析对象                                                                       | ParserTemplate |
| params | 参数，可参考[区块渲染](/base/template-section)中的区块参数章节，该属性**不代表参数值**，而是**参数名称** | string[]       |

### VNode.Event

VNode.Event 作为 Joker 前端中事件处理对象，无论是通过 JS 主动响应的事件还是原生事件触发，都会将该类型作为第一个参数传递到事件处理函数中。

其中该对象中具有一个`data`属性，代表事件传递的参数，可通过泛型来指定值类型，方便后续操作，默认为 undefined。

| 属性名称        | 说明                         | 类型                 |
| --------------- | ---------------------------- | -------------------- |
| eventName       | 事件名称                     | string               |
| event           | 原生事件对象，取决于运行平台 | any                  |
| target          | 响应该事件的虚拟节点         | VNode.Node/undefined |
| data            | 事件参数                     | <T>:any              |
| preventDefault  | 阻止默认事件                 | function             |
| stopPropagation | 阻止事件传播                 | function             |

关于事件处理函数类型（EventCallBack），所有事件的处理函数的 **首个参数一定是 VNode.Event**。

```ts
export type EventCallBack<T = any> = (e: VNode.Event<T>) => void;
```

> 关于事件处理可通过查看[组件 API](/base/component-api)中的$on 和 [模板组件注册](/base/template-event)进行学习。
