## 区块渲染

该章节主要介绍父子组件传值的另一种形式。

### 什么是区块渲染

父子组件除了使用`props`去传递参数外，我们也提供另一种形式的传值，我们可以将一段 **待渲染（Render）** 的内容传递到子组件，并由子组件决定该渲染模板什么时机、什么位置进行渲染。

```html
<my-component> 我是一个待渲染的内容 </my-component>
```

可以看到我们可以在自定义组件标签内容区块内来指定我们待渲染的模板区块内容。

### 如何使用

我们可以直接在组件标签内来定义`待渲染区块`的内容，也可以使用`section`指令来定义，当我们只有一个待渲染区块，并且没有渲染参数时，该指令可以被省略。

```xml
<my-component>
    <p>我是一个待渲染的区块模板</p>
</my-component>

👇👇👇等同于👇👇👇
<my-component>
    @section(){
        <p>我是一个待渲染的区块模板</p>
    }
</my-component>

👇👇👇等同于👇👇👇

<my-component>
    @section('default'){
        <p>我是一个待渲染的区块模板</p>
    }
</my-component>
```

若我们不指定区块名称，则默认为**default**。当然，我们也可以定义多个待渲染区块：

```xml
<my-component>
    <p>我是一个待渲染的默认区块模板</p>

    @section('top'){
        <p>我是一个待渲染的Top区块模板</p>
    }

    <p>我是一个待渲染的默认区块模板（第二条）</p>

    @section('bottom'){
        <p>我是一个待渲染的Bottom区块模板</p>
    }
</my-component>
```

我们会将 **具有名字** 的渲染区块合并在一起，组成该名称下的渲染内容，将未指定名称的渲染区块统一合并为`default`区块。

接下来看一下具体执行效果：

!!!demo1!!!

结合上面的例子，我们看一下子组件是如何渲染这些区块的，以下是子组件代码：

```html
<template>
    <p class="title">Top区块内容：</p>
    @RenderSection("top")
    <p class="title">正文内容：</p>
    @RenderSection()
    <p class="title">Bottom区块内容：</p>
    @RenderSection("bottom")
</template>

<style lang="scss" scoped>
    p.title {
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
    }
</style>
```

通过上面代码可以发现，我们通过`RenderSection` API ，既可以实现待渲染区块模板的渲染。可以通过指定第一个参数来渲染不同的区块模板，若不传递区块名称，默认渲染**default**区块。

### 区块操作

如果你是在开发组件时，你可能会需要判断在调用该组件时，是否传入了待渲染模板，我们可以使用[组件属性](/base/component-property)中的`$sections`来进行判断，例如：

```xml
<div>
    @if($sections.default){
        <p>@RenderSection()</p>
    }
    else{
        <p class="default">默认信息</p>
    }
</div>
```

通过上面的代码我们就可以做到，如果传入待渲染区块模板，就渲染模板，否则展示默认提示信息。

### 渲染参数

在渲染模板的过程中，某些情况下需要传递关键数据，尤其是在使用列表组件时。我们不仅需要提供列表项的渲染模板，还必须为循环中的每一项提供相应的数据，以确保渲染过程能够顺利进行。

我们的传递参数非常直观，我们分为传参和接收参数两个代码片段来介绍下语法规则，首先是传递参数：

```xml
<p>
    @RenderSection('default','我是参数1',我是变量,...)
</p>
```

值的注意的是，如果需要传递参数，参数是从第二个参数开始的，这也就以为着我们一定要表明我们的区块名称，参数可以是静态值，也可以是组件的属性。

接下来我们看一下在父组件如何接收子组件通过区块渲染传递的参数：

```xml
<my-component>
@section('default',v1,v2,v3){
    <p>参数1：@v1</p>
    <p>参数2：@v2</p>
}
</my-component>
```

通过上面代码可以看到，和传递参数一样，我们的参数也是从第二个参数开始的，参数个数和顺序对应传递参数时的规则。

接下来看一个运行的示例：

!!!demo2!!!

以下是`list-component`的组件示例代码：

```xml
<template>
    <ul>
        @for(let item of props.list) {
            <li>
                @if($sections.default) {
                    @RenderSection("default", item)
                }
                else {
                    @item
                }
            </li>
        }
    </ul>
</template>
```

### 跨组件传递（高阶）

当有些复杂的组件开发中，父组件传入的待渲染区块模板，不一定要是该组件去执行渲染，可能会继续向下传递，由深层组件去执行模板的渲染，那这样我们就需要区块模板的`跨组件传递`了。

首先我们先了解下`RenderSection` API，它的第一个参数可以是**string**，也可以是`SectionType`（可以去[组件属性](/base/component-property)中的`$sections`去了解），既然区块对象可以被传递，那我们就可以使用这种方式来实现跨组件的区块渲染了：

```xml
<template>
    @RenderSection(topSection,'我是参数')
</template>
```

```ts
class extends Component{
    get topSection(){
        //向上查找，并拿到要渲染的插槽
        return this.$rootVNode.closest(...)?.component.$sections.top;

        //当然也可以作为参数传递
        return this.props.topSection;
    }
}
```
