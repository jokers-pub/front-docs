## Event Registration

This section introduces how to register interactive events for tags/components in the template.

### Listening to Events  

We can use the `@('@event-name')` directive to listen to DOM/component events and execute corresponding JavaScript when the event is triggered.

```html
<button @click="handleClick">Button</button>
```  

The example above demonstrates registering a `click` event for a button with the event handler function **handleClick**.  

!!!demo1!!!

### Passing Event Parameters  

There are two types of event parameters:  

1. **Event Object Parameter**: This parameter is passed by [`$trigger`](/base/component-api) and propagates through components along with the event.  
2. **Execution Event Method Parameter**: This parameter acts as the event argument, applying only to the current component and the ongoing event.  

Here’s how to pass parameters during event execution:  

```html
<template>
    <button @click="handleClick('parameter')">Button</button>
</template>
<script>
    import { Component } from "@joker.front/core";
    export default class extends Component {
        handleClick(e: VNode.Event, param: string) {
            //TODO: param
        }
    }
</script>
```  

!!!demo2!!!  

### Introduction to VNode.Event  

`VNode.Event` serves as the event handling object in **Joker Frontend**. Whether the event is actively triggered via JS or originates from a native event, this type is passed as the first parameter to the event handler function.  

This object includes a `data` property, representing the event parameters. It can be typed using generics for ease of use in subsequent operations (default: `undefined`).  

| Property         | Description                         | Type                   |
|------------------|-------------------------------------|------------------------|
| `eventName`      | Event name                        | `string`               |
| `event`          | Native event object (platform-dependent) | `any`                  |
| `target`         | The virtual node responding to the event | `VNode.Node`/`undefined` |
| `data`           | Event parameter(s)                 | `<T>: any`             |
| `preventDefault` | Prevents the default event         | `function`             |
| `stopPropagation` | Stops event propagation           | `function`             |  

### Event Modifiers  

We provide a rich set of **event modifiers** to help developers handle logic more efficiently without delving into DOM event complexities.  

With **Joker's VSCODE tool**, suggested modifiers appear automatically when typing an event. The currently available modifiers include:  

| Modifier   | Description                                                                                                                                                                        |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `stop`     | Stops event bubbling (equivalent to `event.stopPropagation()` in JavaScript).                                                                                                    |
| `prevent`  | Prevents the default behavior (if the event can be canceled, it is canceled without stopping propagation; equivalent to `event.preventDefault()`).                               |
| `self`     | Only triggers the event if the current element is the target. The handler does not fire if the event originates from child elements.                                             |
| `once`     | Ensures the event fires only once and is then automatically removed.                                                                                                            |
| `passive`  | Signals the browser that the event handler does not call `preventDefault()`, optimizing performance for passive event listeners.                                                   |
| `outside`  | Triggers the event only when clicking an area **outside** the element. Implemented via global event listeners. Recommended to use with `if` to ensure proper cleanup.             |

> **Note on `outside`**: The `outside` modifier checks whether the triggered DOM event target is **not** within the node (including nested elements) **and** is also not a contained relationship in the **VNode.Node** structure. For details, refer to the **append-to** property in [Component Built-in Properties](/base/template-property).  

For **keyboard events**, the following modifiers are available:  

| Modifier | Key                     |
|----------|-------------------------|
| `enter`  | Enter key               |
| `tab`    | Tab key                 |
| `delete` | Delete/Backspace key    |
| `esc`    | Escape key              |
| `space`  | Spacebar                |
| `up`     | Up arrow key            |
| `down`   | Down arrow key          |
| `left`   | Left arrow key          |
| `right`  | Right arrow key         |  

For **mouse events**, we provide these modifiers:  

| Modifier | Mouse Action          |
|----------|-----------------------|
| `left`   | Left mouse button     |
| `right`  | Right mouse button    |
| `middle` | Middle mouse wheel    |  

**System Modifiers** (available for keyboard/mouse events):  

| Modifier | Key            |
|----------|----------------|
| `ctrl`   | Ctrl key       |
| `alt`    | Alt key        |
| `shift`  | Shift key      |  

**Note**: These modifiers can be **chained together** for a single event to accommodate different scenarios:  

```html
<button @click.ctrl.prevent.stop="handleClick">Button</button>
```