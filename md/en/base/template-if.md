## Conditional Rendering

This chapter mainly introduces how to implement logical branching in the `template`.

### if

Use `@('@if(condition)'){ ... }` in templates to implement logical branches. It is used to conditionally render a block of content. The content block will only be rendered when the directive's expression evaluates to a truthy value. The `if(condition)` condition can be a value, expression, property, or method call.

```xml
@if(value){
    <p>I am a paragraph</p>
}
```

As seen in the code example above, the syntax is the same as using if in JavaScript, except that Joker's `if / else if / else` directives must use `{}` to wrap your content. The curly braces **cannot be omitted**.

!!!demo1!!!

### else if

`else if` cannot exist independently. It must be used together with the `if` directive. When using `else if`, there is no need to prefix it with `@`. The start of `if` already indicates the beginning of a directive, and `else if` is just a syntax for logical branching.

**else if** and **if** must be adjacent siblings; they cannot be separated by hierarchy or cross-level association.

```xml
@if(value===1){
    <p>I am paragraph one</p>
}
else if(value===2){
    <p>I am paragraph two</p>
}
else if(value===3){
    <p>I am paragraph three</p>
}
...
```

!!!demo2!!!

> It is worth noting that the evaluation order is top-down. If a preceding condition evaluates to true, even if a later else if condition is also true, it will not be rendered (but the condition will still execute—see below).

It is important to understand that **if** and **else if** in `template` do not execute top-down in the same way as traditional coding runtime mechanisms. Although we internally implement a top-down conditional execution mechanism to control rendering, the conditions in **if** and **else if** will run and attempt to resolve results every time. Therefore, **constraints should be independent rather than interrelated**. The purpose is to enable `local condition updates for ultimate responsive performance experience`. Let's look at an example for clarity:

```xml
@if(array===undefined){
    <p>I am paragraph one</p>
}
else if(array.length===0){
    <p>I am paragraph two</p>
}
else {
    <p>I am paragraph three</p>
}
```

In the example above, if `array` is undefined, the evaluation condition in `else if` will throw an error because it cannot read the `length` property. Thus, the correct way to write it is:

```xml
@if(array===undefined){
    <p>I am paragraph one</p>
}
else if(array && array.length===0){
    <p>I am paragraph two</p>
}
else {
    <p>I am paragraph three</p>
}
```

### else

The `else` keyword can pair with `if` or other `else if` statements in an `if-else` chain. When the `if` condition is not satisfied, the program continues executing the code block after `else`. In an `if-else` chain, only the last `else` (if there are no `else if` statements) can exist independently. Other `else` statements must pair with `if` or `else if`.

```xml
@if(value===1){
    <p>I am paragraph one</p>
}
else if(value===2){
    <p>I am paragraph two</p>
}
else {
    <p>I am paragraph three</p>
}
```

!!!demo3!!!

### Deep Dive into the Mechanism

During conditional rendering, only the first matching logic block will be rendered. Otherwise, the `else` block will be rendered (if there is one) or nothing will be rendered (if there is no else). When dynamically configuring a component's display state, its appearance and disappearance actually involve **creation** and **destruction** operations of the component.

The following example demonstrates how logic blocks work in practice:

**Subcomponent Code:**
```html
<template>
    <p>I am a child component @props.name</p>
</template>
<script>
    import { Component } from "@joker.front/core";
    import { Message } from "@joker.front/ui";

    export default class extends Component<{
        name: string
    }> {
        mounted() {
            Message({
                message: `${this.props.name} is initialized and mounted`,
                type: "success"
            });
        }
        beforeDestroy() {
            Message({
                message: `${this.props.name} is destroyed`,
                type: "warning"
            });
        }
    }
</script>
```

!!!demo4!!!

Of course, you can also use `keep-alive` in if conditions to maintain state during switching when needed.

!!!demo5!!!