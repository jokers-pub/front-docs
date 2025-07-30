## Overview of Joker Component Styles

This chapter mainly introduces the rendering styles of the component template. We can use the `style` tag to add styles to the template.

### Overview

The `style` tag supports three types of style languages. By default, it is `css`, and in addition, it also includes `scss` and `less`. We can switch the style language by configuring the `lang` attribute of the `style` tag (after switching, the Joker Front Tools VSCODE extension will also automatically switch the corresponding style highlighting and code-checking mechanisms). Now, let's take a look at an example:

```html
<style lang="scss">
    div {
        span {
            background: red;
        }
    }
</style>
```

### Style Scope

In addition to the `lang` attribute, the `style` tag also provides the `scoped` style. When the `<style>` tag has the `scoped` attribute, its CSS will only affect the elements of the current component, which is similar to the style encapsulation in Shadow DOM. There are some precautions when using it, but the advantage is that no polyfill is required. Its implementation method is through PostCSS to transform the following content:

```html
<template>
    <div class="example">Hello</div>
</template>
<style scoped>
    .example {
        color: red;
    }
</style>
```

Into:

```html
<template>
    <div class="example" data-scoped-981d2c8a>Hello</div>
</template>
<style>
    .example[data-scoped-981d2c8a] {
        color: red;
    }
</style>
```

Using the style scope can effectively isolate the styles between components.

### Style Penetration

After using `scoped`, the styles of the parent component will not penetrate into the child component. However, the root node of the child component will be affected by both the scoped styles of the parent component and the scoped styles of the child component. This design allows the parent component to adjust the style of the root element of its child component from a layout perspective.

Of course, in some specific scenarios where we need to change the style of a child component with `scoped` from the parent node, we can use `:deep()` to penetrate the style and achieve the style change of the child component. For example:

```html
<style scoped>
    .a :deep(.b) {
        /*... */
    }
</style>
```

The above code will be compiled into:

```css
.a[data-scoped-981d2c8a].b {
    /*... */
}
```

We often use style penetration to control the styles of child components. Of course, we can also use style penetration in the child component to change the style of the **block template of the parent container**.
