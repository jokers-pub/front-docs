## Joker Component Styling Overview

This section introduces the rendering styles for component templates. We can use the `style` tag to add styles to template rendering.

### Overview 

The style tag supports three styling languages by default: `css`, along with `scss` and `less`. We can switch between styling languages by configuring the **lang** attribute of the style tag (after switching, the Joker Front Tools VSCode extension will automatically apply the corresponding syntax highlighting and code inspection). Let's look at an example:

```html  
<style lang="scss">
    div {
        span {
            background: red;
        }
    }
</style>
```

### Scoped Styles

In addition to the lang attribute, the style tag also provides the `scoped` attribute. When a <style> tag has the scoped attribute, its CSS will only affect elements within the current component, similar to style encapsulation in Shadow DOM. There are a few caveats when using it, but the benefit is that it requires no polyfill. The implementation works via PostCSS to transform the following:  

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

Scoped styles effectively isolate styles between components.

### Style Deep Penetration  

With scoped enabled, parent component styles won't propagate into child components. However, a child component's root node will be affected by both the parent's scoped styles and its own scoped styles. This design allows parents to adjust child root element styles from a layout perspective.

For certain use cases where a parent needs to modify styles of a child component with scoped, we can use `:deep()` to penetrate styles and alter child component styles. For example:  

```html
<style scoped>
    .a :deep(.b) {
        /* ... */  
    }
</style>
```

The above code will be compiled into:  

```css
.a[data-scoped-981d2c8a] .b {
    /* ... */
}
```

We frequently use style deep penetration to control child component styling. It can also be used in child components to modify **parent container block template** styles.