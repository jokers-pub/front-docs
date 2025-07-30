## Event Registration

This chapter mainly introduces how to register interaction events for tags/components in the template.

### Listening for Events

We can use the `@('@eventName')` directive to listen for DOM/component events and execute the corresponding JavaScript when the event is triggered.

```html
<button @click="handleClick">Button</button>
```

The above code example means that we register a `click` event for the `button` button, and the event handling function is **handleClick**

!!!demo1!!!

### Passing Parameters in Event Execution

There are two types of event parameters:

-   One is the event object parameter, which is passed by [$trigger](/base/component-api). This parameter will flow within the component along with the event.
-   The other is the parameter of the event execution method. This parameter is used as the parameter of this event and will only take effect in the current component and this event.

Let's see how to pass parameters in event execution:

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

VNode.Event is the event handling object in Joker front-end. Whether it is an event actively responded to by JS or a native event trigger, this type will be passed as the first parameter to the event handling function.

Among them, this object has a `data` property representing the parameter passed by the event. The value type can be specified through generics for convenient subsequent operations, and the default value is `undefined`.

| Property Name   | Description                                            | Type                 |
| --------------- | ------------------------------------------------------ | -------------------- |
| eventName       | Event name                                             | string               |
| event           | Native event object, depending on the running platform | any                  |
| target          | The virtual node that responds to the event            | VNode.Node/undefined |
| data            | Event parameter                                        | <T>:any              |
| preventDefault  | Prevent the default event                              | function             |
| stopPropagation | Prevent event propagation                              | function             |

### Event Modifiers

We provide a rich set of event modifiers to help developers handle logic more efficiently without delving into the complex details of DOM events.

Combined with Joker's VSCODE tool, optional modifiers can be automatically prompted after the event. Currently, the provided modifiers are:

| Modifier | Description                                                                                                                                                                                                                                                                                                                        |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stop     | Prevents event bubbling, equivalent to `event.stopPropagation()` in JavaScript                                                                                                                                                                                                                                                     |
| prevent  | Prevents the default behavior from being executed (if the event is cancelable, cancel the event without stopping the further propagation of the event), equivalent to `event.preventDefault()` in JavaScript                                                                                                                       |
| self     | Only triggers events within its own scope, excluding child elements. The handler is only triggered when `event.target` is the current element itself, that is, the event is not triggered from an internal element                                                                                                                 |
| once     | Triggers only once and immediately removes the event after execution                                                                                                                                                                                                                                                               |
| passive  | It is a parameter used to mark the event handler, telling the browser that the event handler will not be called                                                                                                                                                                                                                    |
| outside  | The event is triggered only when clicking on an area outside of itself. This event is implemented through global event listening. It is recommended to use `outside` in conjunction with `if` to ensure that the element will be destroyed immediately. When the element is destroyed, the global event listening will be removed. |

> Regarding the `outside` modifier, the monitoring logic of `outside` is that the event-triggering object in the actual output DOM is not inside (including containment) the node `and` is not in a containment relationship in the **VNode.Node** structure. For detailed scenarios, please refer to the **append-to** property in [Component Built-in Attributes](/base/template-property).

When the event type is a keyboard event, the following modifiers are provided:

| Modifier | Description                        |
| -------- | ---------------------------------- |
| enter    | Enter key                          |
| tab      | Tab key                            |
| delete   | Includes delete and backspace keys |
| esc      | Escape key                         |
| space    | Space key                          |
| up       | Up arrow key                       |
| down     | Down arrow key                     |
| left     | Left arrow key                     |
| right    | Right arrow key                    |

When the event type is a mouse event, we provide the following modifiers:

| Modifier | Description        |
| -------- | ------------------ |
| left     | Left mouse button  |
| right    | Right mouse button |
| middle   | Middle mouse wheel |

The following are system modifiers provided when the event is of keyboard/mouse type:

| Modifier | Description |
| -------- | ----------- |
| ctrl     | Ctrl key    |
| alt      | Alt key     |
| shift    | Shift key   |

It is worth noting that these modifiers can be used in combination. We can add multiple modifiers to an event to meet different scenario requirements. For example:

```html
<button @click.ctrl.prevent.stop="handleClick">Button</button>
```
