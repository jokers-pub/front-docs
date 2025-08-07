## List Rendering

This section will cover how to implement loop logic in `template`.

### for(let .. of ..)

Using `for..of` allows quick iteration over all items/values in an array/object. Its usage is consistent with JavaScript.

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

        obj:{
            userName:"Zhang San",
            age:12
        }
    }
</script>
```

!!!demo1!!!

From the example above, we can see that we can use `let` to define an **item** property within the for loop, which only takes effect within the `for` code block. 
Let's look at the scope of value definitions through the following example:

!!!demo2!!!

### fro(let .. in ..)

The `for..in` directive is another looping command. Unlike `for..of`, it iterates over the **indexes** of objects/arrays.

Using the same example, let's see the output of **for...in**:

!!!demo3!!!

As shown in the example, the **item** defined by `let` represents the index of each item during iteration. Of course, we can also use expressions within the `for` code block to output values:

```xml
@for(let item in list){
    <p>@list[item]</p>
}
```

!!!demo4!!!

In addition to the above usage, we also provide a full-parameter looping syntax:

```xml
@for(let (index,item) in list){
    <p>@list[index] ===  @item</p>
}
```

When the let value follows the `()` pattern, the first parameter is treated as the index key, and the second parameter as the item key. This syntax can only be used in the `for in` directive.

### for(..;..;..)

Besides the two commonly used loop directives mentioned above, we also provide custom expression loops, allowing more complex iterations.

For example:

!!!demo5!!!

> We do not recommend modifying values defined outside the for loop within expressions.

### Deep Dive into Principles

This section mainly explains the data reactivity mechanism and node updating mechanism in list rendering.

Since `Joker`'s data reactivity processing associates VNodes with actual output nodes, data changes will immediately trigger corresponding node updates. When modifying a specific item, only the DOM node changes related to that modification will be executed, while unchanged nodes will not undergo updates.

!!!demo6!!!

When the list/object to be iterated changes **in length**, we perform a full iteration from the beginning. The looped **values** are compared with previously rendered values. If they are the same, no **Render** operation is performed. If there are changes, the rendered nodes are destroyed and new nodes are inserted. After the loop completes, any **excess nodes (when the current rendering length is less than the original length)** are destroyed. It's worth noting that the **value comparison** mentioned here refers to **expression values** rather than virtual DOM comparison, making this process extremely fast.

When modifying property values within a list/object **without changing its length**, the list iteration is not triggered. Instead, only the rendering nodes of the **list items** are updated directly.