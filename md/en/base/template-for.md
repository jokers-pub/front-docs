## List Rendering

This chapter will introduce how to implement loop logic in `template`.

### for(let.. of..)

Using `for..of` can quickly iterate over all items/values in an array/object. Its usage is the same as that in `javascript`.

```xml
<template>
    @for(let item of list){
        <p>@item</p>
    }
    @for(let item of obj){
        <p>@item</p>
    }
</template>
```

```html
<script>
    import { Component } from "@joker.front/core";

    export default class extends Component {
        list = ["Zhang San", "Li Si", "Wang Wu",...];

        obj = {
            userName: "Zhang San",
            age: 12
        };
    }
</script>
```

!!!demo1!!!

From the above example, we can see that we defined an **item** property using `let` in the `for` loop, and this property only takes effect within the `for` code block. Let's take a look at the scope of the value definition through the following example:

!!!demo2!!!

### for(let.. in..)

The `for..in` directive is also a loop command. Different from `for..of`, the value it loops through is the **index** of the object/array.

Let's look at the output of **for...in** with the same example:

!!!demo3!!!

As can be seen from the above example, the **item** defined by `let` represents the index of each item during the loop. Of course, we can also use expressions in the `for` code block to complete the output of values:

```xml
@for(let item in list){
    <p>@list[item]</p>
}
```

!!!demo4!!!

In addition to the above usage, we also provide a full-parameter loop syntax:

```xml
@for(let (index,item) in list){
    <p>@list[index] ===  @item</p>
}
```

When the value of `let` follows the `()` rule, we will use the first parameter as the index key `index` and the second parameter as the item key `item`. This usage can only be used in the `for in` directive.

### for(..;..;..)

In addition to the above two commonly used loop directives, we also provide a custom expression loop, allowing us to use custom expressions to achieve more complex loops.

For example:

!!!demo5!!!

> We do not recommend modifying values that are not defined in the `for` loop within the expression.

### In-depth Principles

In this section, we mainly introduce the data response mechanism and node update mechanism of the loop list.

Since `Joker`'s data response processing associates the VNode with the actual output node, changes in data will immediately trigger corresponding node change operations. When we modify a certain item, only one DOM node change operation will be executed in the end, and nodes without changes will not perform update operations.

!!!demo6!!!

When the list/object to be looped changes `(in length)`, we will perform a loop from the beginning. The **values** of the loop will be compared with the rendered values. If they are the same, no **Render** rendering will be performed. If there are changes, the rendered nodes will be destroyed and new nodes will be inserted. After the loop ends, the **extra nodes (when the current rendering length is less than the original length)** will be destroyed. It should be noted that the **value comparison** we mentioned earlier refers to the **value of the expression** rather than the virtual DOM comparison, and its response speed is extremely fast.

When changing the value of a property in the list/object **(not a length change)**, it will not trigger the list loop, and the rendering node of the **list item** will be directly updated.
