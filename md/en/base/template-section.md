## Block Rendering

This chapter introduces another form of parent-child component value passing.

### What is Block Rendering

In addition to using `props` to pass parameters between parent and child components, we also provide another form of value passing. We can pass a piece of **renderable content** to the child component, and the child component decides when and where this template should be rendered.

```html
<my-component> I am a renderable content </my-component>
```

As shown above, we can specify the renderable template block content within the custom component tags.

### How to Use

We can directly define the content of the `renderable block` within the component tags or use the `section` directive to define it. When there is only one renderable block and no rendering parameters, this directive can be omitted.

```xml
<my-component>
    <p>I am a renderable block template</p>
</my-component>

👇👇👇Equivalent to👇👇👇
<my-component>
    @section(){
        <p>I am a renderable block template</p>
    }
</my-component>

👇👇👇Equivalent to👇👇👇

<my-component>
    @section('default'){
        <p>I am a renderable block template</p>
    }
</my-component>
```

If no block name is specified, it defaults to **default**. Of course, we can also define multiple renderable blocks:

```xml
<my-component>
    <p>I am a renderable default block template</p>

    @section('top'){
        <p>I am a renderable Top block template</p>
    }

    <p>I am a renderable default block template (Second line)</p>

    @section('bottom'){
        <p>I am a renderable Bottom block template</p>
    }
</my-component>
```

Blocks **with names** will be merged together to form the rendering content under that name, while blocks without specified names will all be merged into the `default` block.

Let’s look at the specific execution effect:

!!!demo1!!!

Combining the above example, let’s see how the child component renders these blocks. The following is the child component code:

```html
<template>
    <p class="title">Top block content:</p>
    @RenderSection("top")
    <p class="title">Main content:</p>
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

From the above code, we can see that the `RenderSection` API can be used to render the renderable block templates. Different block templates can be rendered by specifying the first parameter. If no block name is passed, the **default** block is rendered by default.

### Block Operations

If you are developing a component, you might need to check whether a renderable template has been passed when the component is called. We can use the `$sections` in the [Component Properties](/base/component-property) to determine this, for example:

```xml
<div>
    @if($sections.default){
        <p>@RenderSection()</p>
    }
    else{
        <p class="default">Default message</p>
    }
</div>
```

The above code ensures that if a renderable block template is passed, it will be rendered; otherwise, a default prompt message will be displayed.

### Rendering Parameters

During the template rendering process, key data may need to be passed in certain scenarios, especially when using list components. Not only do we need to provide the rendering template for list items, but we also must provide the corresponding data for each item in the loop to ensure the rendering process can proceed smoothly.

Our parameter passing is very intuitive. We divide it into two code segments to introduce the syntax rules: passing parameters and receiving parameters. First, passing parameters:

```xml
<p>
    @RenderSection('default','I am parameter 1',myVariable,...)
</p>
```

It’s worth noting that if parameters need to be passed, they start from the second parameter, which means we must specify the block name. Parameters can be static values or component properties.

Next, let’s look at how the parent component receives the parameters passed by the child component through block rendering:

```xml
<my-component>
@section('default',v1,v2,v3){
    <p>Parameter 1: @v1</p>
    <p>Parameter 2: @v2</p>
}
</my-component>
```

As seen in the above code, similar to passing parameters, the parameters also start from the second parameter, and the number and order of parameters correspond to the rules when passing parameters.

Now, let’s look at a running example:

!!!demo2!!!

The following is the example code for the `list-component`:

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

In the development of some complex components, the renderable block template passed by the parent component does not necessarily have to be rendered by this component. It might continue to be passed down, and the deep-level component will execute the template rendering. In this case, we need **cross-component passing** of block templates.

First, let’s understand the `RenderSection` API. Its first parameter can be a **string** or `SectionType` (refer to `$sections` in [Component Properties](/base/component-property)). Since the block object can be passed, we can use this method to achieve cross-component block rendering:

```xml
<template>
    @RenderSection(topSection,'I am a parameter')
</template>
```

```ts
class extends Component{
    get topSection(){
        //Search upward and get the slot to be rendered
        return this.$rootVNode.closest(...)?.component.$sections.top;

        //Can also be passed as a parameter
        return this.props.topSection;
    }
}
```