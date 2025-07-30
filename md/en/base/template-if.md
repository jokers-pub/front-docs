## Conditional Rendering

This chapter mainly introduces how to implement a logical branch in the `template` template.

### if

In the template, use `@('@if(condition){... }')` to implement a logical branch. It is used to conditionally render a block of content. This content will only be rendered when the expression of the directive returns a truthy value. The condition in `if(condition)` can be a value, an expression, a property, or a method call.

```xml
@if(value){
    <p>This is a paragraph</p>
}
```

From the above code example, it can be seen that the syntax is the same as that of `if` in JavaScript, except that the `if / else if / else` directives provided by Joker must use `{}` to enclose your content, and the curly braces **cannot be omitted**.

!!!demo1!!!

### else if

`else if` cannot exist independently. It must be used together with the `if` directive. When using `else if`, there is no need to add `@` in front. The start of `if` already indicates the start of a directive, and `else if` is just a logical branch syntax.

**else if** and **if** must be adjacent and at the same level. They cannot be associated across positions or levels.

```xml
@if(value === 1){
    <p>This is paragraph one</p>
}
else if(value === 2){
    <p>This is paragraph two</p>
}
else if(value === 3){
    <p>This is paragraph three</p>
}
...
```

!!!demo2!!!

> It should be noted that the `if` judgments are made in order from top to bottom. If the previous judgment is `true`, even if the conditions of the subsequent `else if` are also `true`, it will not be rendered (the single-judgment condition will be executed, see the following text).

Here, it should be noted that **if** and **else if** in `template` do not execute from top to bottom every time like our traditional coding operation mechanism. Although we have implemented a top-down condition operation mechanism and controlled its rendering internally, the judgment conditions in **if** and **else if** will be run and their results will be tried to be parsed every time. Therefore, the **constraint conditions should be independent rather than related** to achieve the `extreme responsive performance experience of local condition updates in else if`. Let's take a look at an example:

```xml
@if(array === undefined){
    <p>This is paragraph one</p>
}
else if(array.length === 0){
    <p>This is paragraph two</p>
}
else {
    <p>This is paragraph three</p>
}
```

From the above example, it can be seen that if `array` is `undefined`, the judgment condition in `else if` will report an error because it cannot read the `length` property. So the correct way to write it is:

```xml
@if(array === undefined){
    <p>This is paragraph one</p>
}
else if(array && array.length === 0){
    <p>This is paragraph two</p>
}
else {
    <p>This is paragraph three</p>
}
```

### else

The `else` keyword can form a pair with `if`, or it can form a pair with other `else if` statements in an `if-else` chain. When the `if` condition is not met, the program will continue to execute the code block following `else`. In an `if-else` chain, only the last `else` (if there is no `else if` statement) can exist independently, and other `else` must form a pair with `if` or `else if`.

```xml
@if(value === 1){
    <p>This is paragraph one</p>
}
else if(value === 2){
    <p>This is paragraph two</p>
}
else {
    <p>This is paragraph three</p>
}
```

!!!demo3!!!

### In-depth Principles

During conditional rendering, only the logical block whose first condition is met will be rendered. Otherwise, the `else` logical block will be rendered or nothing will be rendered (if there is no `else`). When we need to dynamically configure the display state of a component, its display and hiding are actually operations of **creating** and **destroying** a component.

Let's feel the actual working principle of the logical block through the following example:

This is the code of the child component

```html
<template>
    <p>I'm the child component @props.name</p>
</template>
<script>
    import { Component } from "@joker.front/core";
    import { Message } from "@joker.front/ui";

    export default class extends Component<{
        name: string
    }> {
        mounted() {
            Message({
                message: `${this.props.name} has been initialized and mounted`,
                type: "success"
            });
        }
        beforeDestroy() {
            Message({
                message: `${this.props.name} has been destroyed`,
                type: "warning"
            });
        }
    }
</script>
```

!!!demo4!!!

Of course, you can also use `keep-alive` in `if` to meet the need for state retention during switching.

!!!demo5!!!
