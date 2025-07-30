## Overview of Joker Templates

This chapter mainly introduces the basic usage of `<template>` in Joker SFC (Single-File Component). Joker uses an HTML-based template syntax, combined with our built-in dynamic directives, to achieve page layout.

At the underlying mechanism, Joker compiles the template into highly optimized ( [AST](/base/ast) ) JavaScript code. When rendering, Joker establishes the relationship between virtual nodes and actual rendering nodes to ensure that when the reactive data changes, the node information is updated immediately with the minimum granularity. For knowledge related to virtual DOM and AST, you can further understand it in the subsequent chapter [Virtual Nodes](/base/vnode).

In Joker, all dynamic directives start with the `@` symbol. We provide a rich set of directive syntaxes internally, including dynamic text, conditional judgment, loops, etc., which can help developers quickly develop template layouts.

### Dynamic Text

The most basic form of data binding is text interpolation, which uses the syntax of “@('@property')”:

```html
<span>@value</span>
```

The dynamic text value points to the property name corresponding to the current component instance. You can learn more by referring to [Component Attributes](/base/component-property).

In addition to directly rendering a value, we also provide complex expressions:

```html
<span>@(isTrue? 'I'm content 1' : 'I'm content 2')</span>

<span>@(value + 1)</span>
```

As can be seen from the above code examples, by enclosing with `()`, complex expressions or operations can be implemented inside.

In addition to reading properties and configuring expressions, we can also read `get` properties or display the return value of a `method`. Let's see how to use it in combination with the component instance.

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

> From the above example, it can be seen that if the `get` property depends on reactive data, when the reactive data changes, this property will also be updated and rendered synchronously.

Of course, in some scenarios, although the code depends on reactive data, the value change does not notify the template to update. This may be due to the order of our code. We must access the reactive data to bind the synchronization relationship. If not accessed, the synchronization relationship will not be associated. For example:

```ts
export default class extends Component {
    model = {
        value: 0
    };
    get name() {
        if (false) {
            // The reactive data is not accessed
            return this.model.value + 1;
        }
        return 1;
    }
}
```

The purpose of this is to render the template with the minimum associated relationship, avoid ineffective synchronous rendering, and improve rendering performance.

Next, let's look at a scenario of displaying the return value of a method:

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

As can be seen from the above example, we can directly execute a method in the template and pass parameters. The format is `@('@methodName( param1, param2 )')`.

Excitingly, method calls also support the synchronous rendering mechanism brought about by changes in reactive data.

#### About the Rendered Value Type (Advanced)

If you use `@('@text')` to insert dynamic text in the content of a template tag, during the actual build and run, we will convert it to **createText('text')**. No matter what type of value we get through the property, we will convert it to `String(value?? '')` for return.

!!!demo3!!!

> When we use the `@` symbol in the page to read a string property, in fact, we will convert it to `@('@Text(property)')` for rendering internally. You can use the Text directive to render a property. The Text directive is a built-in function. You can view the list of built-in directives at the end of this article to learn about it.

> When you need to render the `@` symbol and there will be a letter following it, you can use `@('@(\"@\")')xxx` to represent it.

### Render as HTML

If you want to render string content as `HTML`, you can use the internally provided `@Html('<p></p>')` API function for rendering.

> By default, the Html fragment will be rendered using shadow Dom to ensure that the internal style does not affect the outside. Of course, you can pass the second parameter as true to turn off the shadow mode. `@Html('<p></p>', true)`
> Example:

```html
<p>@Html('<span>123</span>')</p>
<p>@Html(propertyName)</p>
```

!!!demo4!!!

### Attributes

The `@` dynamic directive can be used anywhere, including the attributes of a tag:

```html
<p style="color:@fontColor">I'm content</p>
<input value="@inputValue" type="text" />
<input value="I'm already @(age) years old" type="text" />
```

From the above code, it can be seen that we can insert dynamic attribute values wherever we want to make changes. And it also supports changes in reactive data.

!!!demo5!!!

### Component Parameter Passing

We can achieve communication between components through component parameter passing. In addition to the string rendering mentioned above, we can pass any type of property to the component, and the value type depends on the result type returned by the expression.

```html
<my-component
    message="I'm a fixed string"
    age="@(12)"
    user-list="@(['Zhang San', 'Li Si'])"
    checked="@false"
    address-info="@({city: 'Jinan'})"
    post-code="2500@(00)"
/>
```

From the above example, it can be seen that we can use the `@('@()')` method to express complex types. Of course, we can also directly point to the value of a property.

```html
<template>
    <my-component age="@numberValue" user-list="@arrayValue" checked="@booleanValue" address-info="@getObjectValue" />
</template>
<script>
    import { Component } from "@joker.front/core";
    export default class extends Component {
        numberValue = 12;

        get arrayValue() {
            return ["Zhang San", "Li Si"];
        }

        booleanValue = false;

        getObjectValue() {
            return {
                city: "Jinan"
            };
        }
    }
</script>
```

For **boolean**-type values, we have optimized them. As long as there is an attribute, the attribute is not false and has no value set (no `=`), it is treated as **true**.

```html
<my-component checked />

👇👇👇 Equivalent to 👇👇👇

<my-component checked="@true" />
```

In addition, we have optimized the `style` and `class` in the HTML Render mode, supporting the form of passing objects/arrays to define the values of these attributes:

```html
<div
    style="@({
    width: '30px',
    backgroundColor:'red',
    top: false,
    height: undefined
})"
></div>
```

We can specify the `style` as an object type, where the key type is [CSSStyleDeclaration](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration), and the value is the value you need to configure. When the value is undefined/false, we will remove this style attribute.

```html
<div class="@(['c1', 'c2'])"></div>

<div class="@({'c1': true, 'c2': false})"></div>

<div class="@([c1, c2, { c3: true, c4: false }])"></div>
```

In addition to strings, the `class` attribute also supports two forms: arrays and objects. When in object mode, the key represents the style name to be set, and the value represents whether to add this style. The style will only be added when the value is true.

> This section introduced how to pass attributes/parameters to a component or tag. For how a component receives parameter values, you can refer to the **props/propsOption** content in [Component Attributes](/base/component-property).

### Registering Global Methods

Joker itself has integrated a very rich set of directive methods. Of course, you can also extend some global methods to facilitate the rapid development of the project.

```html
<span>Total: @Global.sum(1, 2)</span>
```

```ts
import { registerGlobalFunction } from "@joker.front/core";

registerGlobalFunction("sum", (ag1: number, ag2: number) => {
    return ag1 + ag2;
});
```

### List of Built-in Directives

The following are all the built-in directives of Joker.

| Directive Name | Description                                                                       |
| -------------- | --------------------------------------------------------------------------------- |
| Text           | Insert as text                                                                    |
| Html           | Insert in HTML format                                                             |
| for            | [List Rendering](/base/template-for)                                              |
| if             | [Conditional Rendering](/base/template-if)                                        |
| section        | Used to **specify/mark** block content, [Block Rendering](/base/template-section) |
| RenderSection  | Used to render block content, [Block Rendering](/base/template-section)           |
| Global         | Used to call globally registered methods                                          |
