## Block Rendering

This chapter mainly introduces another form of passing values between parent and child components.

### What is Block Rendering

In addition to using `props` to pass parameters between parent and child components, we also provide another form of value passing. We can pass a section of **content to be rendered (Render)** to the child component, and the child component decides when and where to render this template.

```html
<my-component> I'm a piece of content to be rendered </my-component>
```

As we can see, we can specify the content of the template block to be rendered within the content block of the custom component tag.

### How to Use

We can directly define the content of the `block to be rendered` within the component tag, or use the `section` directive to define it. When we have only one block to be rendered and no rendering parameters, this directive can be omitted.

```xml
<my-component>
    <p>I'm a block template to be rendered</p>
</my-component>

👇👇👇 Equivalent to 👇👇👇
<my-component>
    @section(){
        <p>I'm a block template to be rendered</p>
    }
</my-component>

👇👇👇 Equivalent to 👇👇👇

<my-component>
    @section('default'){
        <p>I'm a block template to be rendered</p>
    }
</my-component>
```

If we don't specify the block name, it defaults to **default**. Of course, we can also define multiple blocks to be rendered:

```xml
<my-component>
    <p>I'm a default block template to be rendered</p>

    @section('top'){
        <p>I'm a Top block template to be rendered</p>
    }

    <p>I'm a default block template to be rendered (the second one)</p>

    @section('bottom'){
        <p>I'm a Bottom block template to be rendered</p>
    }
</my-component>
```

We will combine the **named** rendering blocks together to form the rendering content under that name, and combine the unnamed rendering blocks into the `default` block.

Next, let's take a look at the specific execution effect:

!!!demo1!!!

Combined with the above example, let's see how the child component renders these blocks. The following is the code of the child component:

```html
<template>
    <p class="title">Top block content:</p>
    @RenderSection("top")
    <p class="title">Body content:</p>
    @RenderSection()
    <p class="title">Bottom block content:</p>
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

As we can see from the above code, we can use the `RenderSection` API to render the block templates to be rendered. We can render different block templates by specifying the first parameter. If no block name is passed, the **default** block is rendered by default.

### Block Operations

If you are developing a component, you may need to determine whether a block template to be rendered is passed in when calling this component. We can use `$sections` in [Component Attributes](/base/component-property) to make this judgment. For example:

```xml
<div>
    @if($sections.default){
        <p>@RenderSection()</p>
    }
    else{
        <p class="default">Default information</p>
    }
</div>
```

With the above code, we can achieve that if a block template to be rendered is passed in, it will be rendered; otherwise, the default prompt message will be displayed.

### Rendering Parameters

During the process of rendering templates, in some cases, key data needs to be passed, especially when using list components. We not only need to provide the rendering template for list items but also must provide corresponding data for each item in the loop to ensure the smooth progress of the rendering process.

Our parameter passing is very intuitive. We will introduce the syntax rules in two code snippets: passing parameters and receiving parameters. First, here is passing parameters:

```xml
<p>
    @RenderSection('default','I'm parameter 1', myVariable,...)
</p>
```

It should be noted that if parameters need to be passed, they start from the second parameter. This means that we must specify the block name. Parameters can be static values or component properties.

Next, let's see how the parent component receives the parameters passed by the child component through block rendering:

```xml
<my-component>
@section('default',v1,v2,v3){
    <p>Parameter 1: @v1</p>
    <p>Parameter 2: @v2</p>
}
</my-component>
```

As we can see from the above code, similar to passing parameters, our parameters also start from the second parameter, and the number and order of parameters follow the rules when passing parameters.

Next, let's look at a running example:

!!!demo2!!!

The following is the example code of the `list-component`:

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

### Cross-Component Passing (Advanced)

In the development of some complex components, the block template to be rendered passed in by the parent component does not necessarily need to be rendered by this component. It may be passed down further and rendered by a deeper-level component. Then we need `cross-component passing` of the block template.

First, let's understand the `RenderSection` API. Its first parameter can be a **string** or `SectionType` (you can refer to `$sections` in [Component Attributes](/base/component-property) to learn about it). Since the block object can be passed, we can use this method to achieve cross-component block rendering:

```xml
<template>
    @RenderSection(topSection,'I'm a parameter')
</template>
```

```ts
class extends Component{
    get topSection(){
        // Search upward and get the slot to be rendered
        return this.$rootVNode.closest(...)?.component.$sections.top;

        // Of course, it can also be passed as a parameter
        return this.props.topSection;
    }
}
```
