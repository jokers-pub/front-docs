## Overview of Joker Components

Components are the main building blocks of Joker applications. Each component consists of the following parts:

-   An HTML template for declaring the content to be rendered on the page.
-   A TypeScript class for defining behavior.
-   CSS styles to be applied to the template.

This topic describes how to create and configure Joker components.

First, we need to clarify a concept that everything is a component. Whether it is a page or a functional component, it exists as a component, only the loading timing of the components is different.

### Creating a Component

Create a file with the suffix `.joker`. This file is a Single-File Component (SFC) of a component.

A component is composed of three parts:

1. `<template>` template
2. `<script>` logic script
3. `<style>` component style

Let's introduce these three parts separately.

### template Template

Create a `template` tag within the `.joker` file (the `template` needs to be a top-level tag), which means the content within this tag is our render template. Please see the following example:

```html
<template>
    <div>I'm the content</div>
</template>
```

In the template, `@('@')` represents a dynamic directive. Joker provides a rich set of dynamic directives. You can learn about them through the subsequent tutorial [here](/base/template).

### script Logic Script

Create a `script` tag within the `.joker` file (the `script` needs to be a top-level tag), which means the content within this tag is our logic script. Please see the following example:

```html
<script>
    import { Component } from "@joker.front/core";
    export default class extends Component {
        // The content here is our component logic
    }
</script>
```

### style Component Style

Create a `style` tag within the `.joker` file (the `style` needs to be a top-level tag), which means the content within this tag is our component style. Please see the following example:

```html
<style>
    .div {
        color: #666;
    }
</style>
```

Through the `JOKER FRONT TOOLS` extension in VSCODE, you can quickly create basic component code. This extension provides default quick template hints to help you write Joker components more efficiently.

![vscode-template](/base/vscode-template.png)
