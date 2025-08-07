## Joker Component Overview 

Components are the primary building blocks of Joker applications. Each component consists of the following parts:

- An HTML template that declares what to render on the page  
- A TypeScript class that defines the behavior 
- CSS styles to be applied to the template

This topic describes how to create and configure Joker components.

First, we need to establish a core concept: **everything is a component**. Whether it's a page or a functional module, everything exists as a component - the only difference is the mounting timing.

### Creating a Component 

Create a file with the `.joker` extension. This file represents a Single File Component (SFC).

A component is composed of three parts:  
1. `<template>` template  
2. `<script>` logic script  
3. `<style>` component styles  

Let's introduce these three parts separately.

### Template  

Inside the `.joker` file, create a template tag (it must be a top-level tag) to define the rendering template. See the example below:

```html
<template>
    <div>I am content</div>
</template>
```

In templates, `@('@')` represents dynamic directives. Joker provides a rich set of dynamic directives. You can learn more through the tutorial [here](/base/template).

### Script Logic  

Inside the `.joker` file, create a script tag (it must be a top-level tag) to define the component logic. See the example below:  

```html
<script>
    import { Component } from "@joker.front/core";
    export default class extends Component {
        // Here lies our component logic  
    }
</script>
```

### Component Styles  

Inside the `.joker` file, create a style tag (it must be a top-level tag) to define the component styles. See the example below:

```html
<style>
    .div {
        color: #666;
    }
</style>
```

Using the **JOKER FRONT TOOLS** extension in VSCode, you can quickly generate basic component code snippets. This extension provides template hints by default to help you write Joker components more efficiently.

![vscode-template](/base/vscode-template.png)