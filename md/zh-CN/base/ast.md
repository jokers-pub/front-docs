## AST 语法树

本章主要介绍 Joker 的 模板语法树（AST）。

### 概述

AST 是 Joker 中 template 的结构化数据，它最终会结合组件实例来渲染出虚拟 Node，并将虚拟 Node 渲染到对应平台中。

它的来源有两种：

- 通过 **单文件组件（SFC）** 中的 `<template>`标签来编写，编写规则请查看[模板](/base/template)，并通过**CLI**转换为 `AST.Node[]`。
- 通过 Core 中提供的`createText`,`createCommand`等方法使用**js**语法输出 AST.Node[]，并设置到组件 template 属性中。template 属性可查看[组件属性](/base/component-property)中的 template 属性介绍。

两种形式都可以输出 `AST.Node[]`，AST.Node 是 AST 的基础类模型，按照功能划分为：`Text`,`Element`,`Comment`,`Component`四种类型。其中 AST.Node 作为基础模型类，它本身具有以下属性：

| 属性名    | 说明 | 类型       |
| --------- | ---- | ---------- |
| childrens | 子集 | AST.Node[] |
| type      | 类型 | NodeType   |

可通过判断 type 值来确定当前 AST.Node 的类型：

```ts
//该枚举可通过AST.NodeType获得
export enum NodeType {
    TEXT, //文本
    COMMENT, //注释
    ELEMENT, //标签
    COMMAND, //指令
    COMPONENT //动态组件
}

//例如：
item.type === AST.NodeType.COMMENT;
```

### AST.Text 文本

AST.Text 是文本节点的语法类型，它用作表述一个页面中的**静态内容文本**。

例如：

```html
<p>我是内容</p>
```

其中`p`标签中的内容即代表一个 AST.Text。

我们也可以通过 Core 提供的`createText`方法来创建一个静态文本内容（该方法只有一个参数，参数为静态文本内容的值）：

```ts
import { Component, createText } from "@joker.front/core";

export default class extends Component {
    template = () => {
        return [createText("我是内容")];
    };
}
```

该方法将返回一个`AST.Text`对象，此类对象包含一个名为`text`的属性，用于存储静态文本内容。作为 AST（抽象语法树）中的叶节点，它不包含任何子节点。

### AST.Comment 注释

AST.Comment 为注释节点，他可以将 template 中的 html 注释转换为 AST.Node。

```html
<!--我是一条注释-->
```

也可以通过`createComment`函数来创建一条注释节点。

```ts
import { Component, createComment } from "@joker.front/core";

export default class extends Component {
    template = () => {
        return [createComment("我是一条注释")];
    };
}
```

该方法将返回一个`AST.Comment`对象，此类对象包含一个名为`text`的属性，用于存储注释内容。作为 AST（抽象语法树）中的叶节点，它不包含任何子节点。

> 在生产构建时，为了对输出进行压缩，默认不会将 AST.Comment 进行转换，以减小产物体积。

### AST.Element 标签

AST.Element 节点代表一个标签，该标签可以是对应平台的标签节点，例如：div、span 等，也可以时一个组件名称，在 AST 编译过程中，Core 是无法确认当前标签名称是否是一个组件，只有在实际渲染时，结合当前组件的实体对象以及全局组件注册才可确认当前标签是否为一个组件。

所以 AST.Element 作为最常用的节点，它承载着通用标签和组件标签的信息记录，并在运行时进行分流处理。

![AST-Element](/base/ast-element.png)

由于 AST.Element 不区分组件和标签，那我们用一个 html 标签来演示下其工作原理：

```html
<div attr="v1" class="@v2" @click="handleClick">
    <span>我是文本内容</span>
</div>
```

我们可以使用`createElement`方法来改写上面的写法：

```ts
createElement(
    "div",
    {
        attr: "v1",
        class: "@v2",
        "@click": "handleClick"
    },
    [createElement("span", undefined, [createText("我是文本内容")])]
);
```

通过上面的代码可以看出，属性中的动态指令以及事件注册，都没有被解析，而是被完整的传入到 createElement 方法中，为了开发便捷，我们会在方法内部对这些动态指令进行解析。

createElement 方法参数：

| 参数名称 | 说明     | 类型       | 默认值 |
| -------- | -------- | ---------- | ------ |
| tagName  | 标签名称 | string     | -      |
| attr     | 标签属性 | object     | -      |
| children | 标签子集 | AST.Node[] | -      |

AST.Element 的属性（继承于 AST.Node）：

| 属性名     | 说明     | 类型            |
| ---------- | -------- | --------------- |
| tagName    | 标签名成 | string          |
| childrens  | 子集     | AST.Node[]      |
| events     | 事件     | AST.Event[]     |
| attributes | 标签属性 | AST.Attribute[] |

AST.Event 作为标签的事件类型，它包括：

| 属性名        | 说明             | 类型                                                                    |
| ------------- | ---------------- | ----------------------------------------------------------------------- |
| name          | 事件名称         | string                                                                  |
| modifiers     | 事件修饰符       | Array<string>，可查看[事件注册](/base/template-event)中对修饰符的介绍。 |
| functionName  | 事件执行函数名称 | string                                                                  |
| functionParam | 事件执行函数参数 | string                                                                  |

AST.Attribute 作为标签属性类型，它包括：

| 属性名  | 说明                                   | 类型             |
| ------- | -------------------------------------- | ---------------- |
| name    | 属性名称                               | string           |
| value   | 属性值                                 | string/undefined |
| express | 若存在动态指令，则转换为表达式进行存放 | string/undefined |

### AST.Command 指令

AST.Command 作为动态指令节点，负责处理非标签属性外的所有动态值的渲染，通过其属性`cmdName`它可以细分为：`IfCommand(条件指令)`、`ForCommand(循环指令)`、`SectionCommand(区块指令)`以及`PropertyOrFunctionCommand(通用动态值指令)`。

首先介绍下这些细分指令的基础类型（AST.Command），它包括：

| 属性名  | 说明                                     | 类型    |
| ------- | ---------------------------------------- | ------- |
| cmdName | 指令名称                                 | string  |
| isGroup | 是否是组，例如：for、if 等它包括`{}`子集 | boolean |

这些细分指令都可以通过`createCommand`和`createCodeFunction`两个方法来进行创建，其中`createCommand`用于创建`if/for/section`等 group 组节点，而`createCodeFunction`用于创建**动态属性或者方法**。

```ts
createCommand("for", "let item of list", [
    createElement("div", undefined, [
        //创建一个@item
        createCodeFunction("item")
    ])
]);
```

createCommand 函数的参数包括：

| 参数名称  | 说明                                                 | 类型       | 默认值 |
| --------- | ---------------------------------------------------- | ---------- | ------ |
| cmdName   | 指令名称（if/**elseif（无空格）**/else/for/section） | string     | -      |
| param     | 指令参数                                             | string     | -      |
| childrens | 子集                                                 | AST.Node[] | -      |

`createCodeFunction`函数只有一个参数，code（动态表达式），它作为叶子节点没有子集。

我们通过使用`createCommand`创建节点时，我们会在内部根据指令名称去解析参数表达式，并将其转换为对应的 AST 节点类型，可通过判断 cmdName 来确定当前节点的指令类型：

#### IfCommand

| 属性名    | 说明        | 类型                                               |
| --------- | ----------- | -------------------------------------------------- |
| cmdName   | 指令名称    | 'if'                                               |
| kind      | if 条件类别 | `if`/`elseif`/`else`，注意**elseif**中间没有空格。 |
| condition | 条件表达式  | string                                             |
| childrens | 子集        | AST.Node[]                                         |

#### ForCommand

| 属性名    | 说明           | 类型                                                          |
| --------- | -------------- | ------------------------------------------------------------- |
| cmdName   | 指令名称       | 'for'                                                         |
| keyType   | 循环类别       | `in`/`of`/`condition`，分别对应`for in`、`for of`和`条件循环` |
| param     | 循环参数表达式 | `AST.ConditionParam` / `AST.InOrOfParam`                      |
| childrens | 子集           | AST.Node[]                                                    |

ConditionParam 作为条件循环参数类型，它包括：

| 属性名        | 说明                         | 类型   |
| ------------- | ---------------------------- | ------ |
| letKey        | 项的 key 值，即 let **item** | string |
| defaultKeyVal | 项的起始默认值               | any    |
| condition     | 条件表达式                   | string |
| step          | 步骤表达式                   | string |

InOrOfParam 作为`for in`和`for of`的参数类型，它包括：

| 属性名   | 说明               | 类型            |
| -------- | ------------------ | --------------- |
| indexKey | 索引 key           | string/undefind |
| itemKey  | 项 key 值          | string          |
| dataKey  | 需要遍历目标表达式 | string          |

#### SectionCommand

| 属性名    | 说明           | 类型       |
| --------- | -------------- | ---------- |
| cmdName   | 指令名称       | 'section'  |
| id        | 区块 id        | string     |
| paramKeys | 区块参数表达式 | string     |
| childrens | 子集           | AST.Node[] |

### AST.Component 动态组件

该类型不会出现在`template`模板的解析结果内，它作为一种动态组件的节点一般适用于动态 `Render`渲染中。在 **SFC** 静态编译时，应避免采用该方法，而应使用 `AST.Element` 类型，在运行时进行分流。。

```ts
import MyComponent from "./children.joker";

createComponent(
    MyComponent,
    {
        message: "@model.message",
        "@click": "handleClick"
    },
    [
        //子集
        createText("我是文本")
    ]
);
```

该方法会输入三个参数：

| 参数名称  | 说明     | 类型                                             | 默认值 |
| --------- | -------- | ------------------------------------------------ | ------ |
| component | 组件     | IComponent / (new (...arg: any[]) => IComponent) | -      |
| attrs     | 标签属性 | object                                           | -      |
| children  | 标签子集 | AST.Node[]                                       | -      |

通过上面的介绍可以看出，它的作用只适用于已经明确确定的组件渲染，所以它只可以在 js 中去创建，而非在 `<template>` 中创建该类型节点。

AST.Component 属性包括：

| 属性名     | 说明     | 类型                                                                              |
| ---------- | -------- | --------------------------------------------------------------------------------- |
| childrens  | 子集     | AST.Node[]                                                                        |
| attributes | 组件属性 | AST.Attribute[]（可参看 AST.Element 对其的介绍）                                  |
| events     | 组件事件 | AST.Event[] （可参看 AST.Element 对其的介绍）                                     |
| component  | 组件     | IComponent /(new (...arg: any[]) => IComponent) 【已初始化的组件/待初始化的组件】 |
