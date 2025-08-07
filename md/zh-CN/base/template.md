## Joker 模板概述

该章节主要是介绍一下 Joker SFC（单文件组件）中`<template>`的基础用法。Joker 使用一种基于 `HTML` 的模板语法，结合我们内置的动态指令，来实现一个页面的布局。

在底层机制中，Joker 会将模板编译成高度优化的 （[AST](/base/ast)）JavaScript 代码。Joker 在渲染时会建立虚拟 Node 与实际渲染节点关系，以确保响应数据变更时会以最小粒度去即时更新节点信息。对于虚拟 DOM、AST 相关知识，可以在后面章节[虚拟节点](/base/vnode)中进一步了解。

在 Joker 中所有的动态指令都是以`@`符号开始的，我们内部提供了丰富的指令语法，包括：动态文本、条件判断、循环等，可帮助开发人员快速的进行模板布局开发。

### 动态文本

最基本的数据绑定形式是文本插值，它使用的是“@('@属性')”语法：

```html
<span>@value</span>
```

其中动态文本值，指向的属性名称对应当前组件实例的属性，可通过查看[组件属性](/base/component-property)进行了解。

除了直接去渲染一个值，我们也提供复杂的表达式：

```html
<span>@(isTrue?'我是内容1':'我是内容2')</span>

<span>@(value+1)</span>
```

通过上面代码示例可以看到，通过`()`包裹后，即可在内部实现复杂的表达式或者运算。

除了读取属性和配置表达式外，我们也可以读取`get属性`或展示一个`方法返回值`，让我们结合组件实例看一下如何使用的。

```html
<template>
    <span>@name</span>
</template>
<script>
    import { Component } from "@joker.front/core";
    export default class extends Component {
        model = {
            value: 0
        };
        get name() {
            return this.model.value + 1;
        }
    }
</script>
```

!!!demo1!!!

> 通过上面的示例，可以看到，`get`属性内如果依赖了响应数据，当响应数据变更时，该属性也会被同步更改渲染。

当然，有些场景下，虽然代码内依赖了响应数据，但是值变更没有通知模板更新，可能是因为我们的代码顺序的问题，我们必须访问过响应数据才会绑定同步关系，没有访问到则不会关联同步关系。例如：

```ts
export default class extends Component {
    model = {
        value: 0
    };
    get name() {
        if (false) {
            //响应数据没有被访问
            return this.model.value + 1;
        }
        return 1;
    }
}
```

这样做的目的是，以最小的关联关系去渲染模板，避免无效的同步渲染，提高渲染性能。

接下来我们再看一个展示方法返回值的场景：

```html
<template>
    <span>@getName()</span>
</template>
<script>
    import { Component } from "@joker.front/core";
    export default class extends Component {
        model = {
            value: 0
        };
        getName() {
            return this.model.value + 1;
        }
    }
</script>
```

!!!demo2!!!

通过上面的示例可以看到，我们可以在模板中直接去执行一个方法，并可以传递参数，格式为`@('@方法名称( 参数1 , 参数2 )')`。

令人兴奋的是，方法调用也是可以支持响应数据变更带来的同步渲染机制。

#### 关于渲染值类型（高级）

如果你在模板标签内容中使用`@('@文本')`进行动态文本的插入，在实际构建运行时我们会转换为**createText('文本')**，无论我们通过属性取到的值时什么类型，我们都会转换为`String(value??'')`进行返回。

!!!demo3!!!

> 当我们在页面中使用`@`符号去读取一个字符串属性，其实我们内部会将其转换为`@('@Text(属性)')`去渲染，你可以用 Text 指令来渲染一个属性，Text 指令是内置函数。可以查看篇尾的内置指令列表来进行了解。

> 当需要渲染`@`符号时并后面会跟随字母时，可以使用`@('@(\"@\")')xxx`来进行表示。

### 以 HTML 渲染

若想将字符串内容作为`HTML`进行渲染，你可以使用内部提供的`@Html('<p></p>')` API 函数去渲染。

> 默认 Html 片段会使用影子 Dom 去渲染，已实现内部样式不对外影响， 当然你可以传递第二个参数为 true，关闭影子模式。 `@Html('<p></p>',true)`
> 示例：

```html
<p>@Html('<span>123</span>')</p>
<p>@Html(属性名)</p>
```

!!!demo4!!!

### 属性

`@`动态指令可以使用在任何地方，包括一个标签的属性：

```html
<p style="color:@fontColor">我是内容</p>
<input value="@inputValue" type="text" />
<input value="我已经@(age)岁了" type="text" />
```

通过上面的代码，可以看到我们可以在任意想要变更的地方去插入动态属性值。并且也可以支持响应式数据的变更。

!!!demo5!!!

### 组件传参

我们可以通过组件的参数传递，来实现组件之间的通讯，除了上面文章中提到的字符串渲染外，我们可以向组件中传递任何类型的属性，值类型取决于表达式返回的结果类型。

```html
<my-component
    message="我是一个固定的字符串"
    age="@(12)"
    user-list="@(['张三','李四'])"
    checked="@false"
    address-info="@({city:'济南'})"
    post-code="2500@(00)"
/>
```

通过上面的例子可以看到，我们可以使用`@('@()')`的方式来进行复杂的类型表达，当然我们也可以直接指向一个属性的值。

```html
<template>
    <my-component age="@numberValue" user-list="@arrayValue" checked="@booleanValue" address-info="@getObjectValue" />
</template>
<script>
    import { Component } from "@joker.front/core";
    export default class extends Component {
        numberValue = 12;

        get arrayValue() {
            return ["张三", "李四"];
        }

        booleanValue = false;

        getObjectValue() {
            return {
                city: "济南"
            };
        }
    }
</script>
```

针对**boolean**类型的值，我们对其进行了优化，只要有属性，属性不为 false 且未设置值（没有`=`）,则按**true**处理。

```html
<my-component checked />

👇👇👇等同于👇👇👇

<my-component checked="@true" />
```

除此之外，我们针对 HTML Render 模式下的`style`和`class`进行了优化，支持传入对象/数组的形式来定义该属性的值：

```html
<div
    style="@({
    width:'30px',
    backgroundColor:'red',
    top:false,
    height:undefined
})"
></div>
```

我们可以指定 style 为对象类型，其中 key 类型为[CSSStyleDeclaration](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration)，value 值为你需要配置的值，当值为 undefined/false 时，我们会移除该条 style 属性。

```html
<div class="@(['c1','c2'])"></div>

<div class="@({'c1':true,'c2':false})"></div>

<div class="@([c1,c2,{ c3:true,c4:false }])"></div>
```

`class`属性除了字符串外，也支持数组/对象两种形式，当为对象模式时，key 则代表需要设置的样式名称，value 值代表是否要添加该样式，只有 value 值为 true 时样式才会被添加。

> 本小结介绍了如何向一个组件、标签去传递属性/参数，针对组件如何接收参数值，可以看[组件属性](/base/component-property)中的**props/propsOption**内容。

### 注册全局方法

Joker 自身已经集成了非常丰富的指令方法，当然你可以扩展一些全局方法，来方便项目的快速的开发。

```html
<span>合计：@Global.sum(1,2)</span>
```

```ts
import { registerGlobalFunction } from "@joker.front/core";

registerGlobalFunction("sum", (ag1: number, ag2: number) => {
    return ag1 + ag2;
});
```

### 内置指令列表

下面是 Joker 内置的所有指令。

| 指令名称      | 说明                                                          |
| ------------- | ------------------------------------------------------------- |
| Text          | 以文本插入                                                    |
| Html          | 以 HTML 格式插入                                              |
| for           | [列表渲染](/base/template-for)                                |
| if            | [条件渲染](/base/template-if)                                 |
| section       | 用于**指定/标记**区块内容，[区块渲染](/base/template-section) |
| RenderSection | 用于渲染区块内容，[区块渲染](/base/template-section)          |
| Global        | 用于调用全局注册方法                                          |
