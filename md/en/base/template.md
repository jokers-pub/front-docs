## Joker Template Overview  

This section introduces the basic usage of the `<template>` in Joker SFC (Single File Component). Joker employs an `HTML`-based template syntax combined with built-in dynamic directives to implement page layouts.  

At its core, Joker compiles templates into highly optimized [AST](/base/ast) JavaScript code. During rendering, Joker establishes a relationship between virtual Nodes and actual rendered DOM nodes to ensure that updates to reactive data trigger minimal and immediate DOM updates. For details on virtual DOM and AST concepts, refer to the later chapter on [Virtual Nodes](/base/vnode).  

In Joker, all dynamic directives start with the `@` symbol. The framework provides a rich set of directive syntaxes, including dynamic text interpolation, conditional rendering, loops, and more, enabling developers to quickly build template layouts.  

### Dynamic Text  

The most basic form of data binding is text interpolation, achieved using the `@('@property')` syntax:  

```html
<span>@value</span>  
```  

Here, the dynamic text references a property name corresponding to the current component instance's data. You can learn more about this in the [Component Properties](/base/component-property) section.  

Beyond rendering a simple value, Joker supports complex expressions:  

```html
<span>@(isTrue ? 'Content 1' : 'Content 2')</span>  

<span>@(value + 1)</span>  
```  

As shown above, wrapping expressions in `()` allows logic or computations within templates.  

In addition to accessing properties and using expressions, you can also read `getter properties` or display method return values. Let's explore this with a component example:  

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

> **Note**: The example above shows that if a `getter property` depends on reactive data, template updates will automatically reflect changes when the reactive data updates.  

However, in some cases, reactive data changes may not trigger template updates due to dependency tracking mechanism. For instance:  

```ts
export default class extends Component {  
    model = {  
        value: 0  
    };  
    get name() {  
        if (false) {  
            // Reactive data is not accessed  
            return this.model.value + 1;  
        }  
        return 1;  
    }  
}  
```  

This design minimizes unnecessary reactive bindings to optimize rendering performance.  

Next, let's see an example of displaying a method return value:  

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

The example demonstrates calling methods in templates, including passing arguments in the format `@('@methodName(param1, param2)')`. Remarkably, method calls also support reactive updates when underlying data changes.  

#### Rendering Value Types (Advanced)  

When using text interpolation (e.g., `@('@text')`), the runtime converts it to **createText('text')**. All non-string values are automatically coerced to strings via `String(value ?? '')`.  

!!!demo3!!!  

> By default, `@property` is internally converted to `@('@Text(property)')` for rendering. The `Text` directive is a built-in function (see the built-in directives list at the end).  

> To render a literal `@` symbol followed by text (e.g., `@xxx`), escape it as `@('@"@"')xxx`.  

### HTML Rendering  

To render a string as HTML, use the built-in `@Html('<p></p>')` function.  

> By default, HTML fragments are rendered inside a **Shadow DOM** to isolate styles. Pass `false` as the second argument to disable Shadow DOM: `@Html('<p></p>', false)`.  

```html
<p>@Html('<span>123</span>')</p>  
<p>@Html(propertyName)</p>  
```  

!!!demo4!!!  

### Attributes  

The `@` directive works in any context, including HTML attributes:  

```html
<p style="color:@fontColor">Text content</p>  
<input value="@inputValue" type="text" />  
<input value="I am @(age) years old" type="text" />  
```  

These examples show dynamic values applied to attributes, all supporting reactive updates.  

!!!demo5!!!  

### Component Props  

Props enable communication between components. Beyond strings, props can accept any value type based on expressions:  

```html
<my-component  
    message="Static string"  
    age="@(12)"  
    user-list="@(['Alice', 'Bob'])"  
    checked="@false"  
    address-info="@({ city: 'Jinan' })"  
    post-code="2500@(00)"  
/>  
```  

Complex expressions are supported via `@()`. Alternatively, props can reference component properties directly:  

```html
<template>  
    <my-component  
        age="@numberValue"  
        user-list="@arrayValue"  
        checked="@booleanValue"  
        address-info="@getObjectValue"  
    />  
</template>  
<script>  
    import { Component } from "@joker.front/core";  
    export default class extends Component {  
        numberValue = 12;  

        get arrayValue() {  
            return ["Alice", "Bob"];  
        }  

        booleanValue = false;  

        getObjectValue() {  
            return { city: "Jinan" };  
        }  
    }  
</script>  
```  

For **boolean** props, Joker optimizes shorthand syntax. An attribute without a value (or `=false`) defaults to `true`:  

```html
<my-component checked />  

<!-- Equivalent to -->  
<my-component checked="@true" />  
```  

Additionally, `style` and `class` attributes support object/array formats:  

```html
<div  
    style="@({  
        width: '30px',  
        backgroundColor: 'red',  
        top: false,  
        height: undefined  
    })"  
></div>  
```  

The `style` object’s keys correspond to [CSSStyleDeclaration](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration). Values set to `undefined/false` are omitted.  

For `class`:  
```html
<div class="@(['c1', 'c2'])"></div>  

<div class="@({ 'c1': true, 'c2': false })"></div>  

<div class="@([c1, c2, { c3: true, c4: false }])"></div>  
```  

Objects in `class` use keys as class names, with `true`/`false` toggling inclusion.  

> This section covers passing props to components/elements. For receiving props, see **props/propsOption** in [Component Properties](/base/component-property).  

### Global Methods  

Joker includes many built-in directives but also allows extending global methods for project efficiency:  

```html
<span>Total: @Global.sum(1, 2)</span>  
```  

```ts
import { registerGlobalFunction } from "@joker.front/core";  

registerGlobalFunction("sum", (arg1: number, arg2: number) => {  
    return arg1 + arg2;  
});  
```  

### Built-in Directives  

Below is the full list of Joker’s built-in directives.  

| Directive      | Description                                                                 |  
|----------------|-----------------------------------------------------------------------------|  
| Text           | Inserts text content                                                        |  
| Html           | Renders HTML content                                                        |  
| for            | [List rendering](/base/template-for)                                        |  
| if             | [Conditional rendering](/base/template-if)                                  |  
| section        | Marks a reusable content block ([Block rendering](/base/template-section))  |  
| RenderSection  | Renders a marked block ([Block rendering](/base/template-section))          |  
| Global         | Calls globally registered methods                                           |