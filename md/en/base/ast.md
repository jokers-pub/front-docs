## Abstract Syntax Tree (AST)

This chapter mainly introduces the Template Abstract Syntax Tree (AST) of Joker.

### Overview

The AST is the structured data of the `template` in Joker. Ultimately, it combines with the component instance to render virtual nodes and then renders these virtual nodes onto the corresponding platform.

There are two sources for it:

-   Write within the `<template>` tag in a **Single-File Component (SFC)**. Refer to [Template](/base/template) for writing rules, and then convert it to `AST.Node[]` via the **CLI**.
-   Use methods like `createText` and `createCommand` provided by the Core to output `AST.Node[]` using **JavaScript** syntax and set it to the `template` property of the component. Refer to the description of the `template` property in [Component Properties](/base/component-property).

Both forms can output `AST.Node[]`. `AST.Node` is the basic class model of the AST, and it is divided into four types according to functionality: `Text`, `Element`, `Comment`, and `Component`. As the basic model class, `AST.Node` itself has the following properties:

| Property Name | Description | Type         |
| ------------- | ----------- | ------------ |
| children      | Sub-nodes   | `AST.Node[]` |
| type          | Node type   | `NodeType`   |

You can determine the type of the current `AST.Node` by checking the `type` value:

```ts
// This enum can be obtained via AST.NodeType
export enum NodeType {
    TEXT, // Text
    COMMENT, // Comment
    ELEMENT, // Tag
    COMMAND, // Directive
    COMPONENT // Dynamic component
}

// For example:
item.type === AST.NodeType.COMMENT;
```

### AST.Text (Text Node)

`AST.Text` is the syntax type for text nodes, used to represent **static content text** on a page.

For example:

```html
<p>I am the content</p>
```

The content inside the `p` tag represents an `AST.Text`.

We can also create static text content using the `createText` method provided by the Core (this method takes only one parameter, which is the value of the static text content):

```ts
import { Component, createText } from "@joker.front/core";

export default class extends Component {
    template = () => {
        return [createText("I am the content")];
    };
}
```

This method returns an `AST.Text` object. Such an object contains a property named `text` for storing the static text content. As a leaf node in the AST (Abstract Syntax Tree), it does not contain any child nodes.

### AST.Comment (Comment Node)

`AST.Comment` is a comment node that can convert HTML comments in the `template` into `AST.Node`.

```html
<!-- I am a comment -->
```

You can also create a comment node using the `createComment` function.

```ts
import { Component, createComment } from "@joker.front/core";

export default class extends Component {
    template = () => {
        return [createComment("I am a comment")];
    };
}
```

This method returns an `AST.Comment` object. Such an object contains a property named `text` for storing the comment content. As a leaf node in the AST (Abstract Syntax Tree), it does not contain any child nodes.

> During the production build, to compress the output, `AST.Comment` is not converted by default to reduce the output size.

### AST.Element (Tag Node)

The `AST.Element` node represents a tag. This tag can be a tag node of the corresponding platform, such as `div` or `span`, or it can be a component name. During the AST compilation process, the Core cannot determine whether the current tag name represents a component. Only during the actual rendering, by combining the entity object of the current component and the globally registered components, can it be determined whether the current tag is a component.

Therefore, as the most commonly used node, `AST.Element` records information for both general tags and component tags and performs different processing at runtime.

![AST-Element](/base/ast-element.png)

Since `AST.Element` does not distinguish between components and tags, let's use an HTML tag to demonstrate its working principle:

```html
<div attr="v1" class="@v2" @click="handleClick">
    <span>I am the text content</span>
</div>
```

We can rewrite the above code using the `createElement` method:

```ts
createElement(
    "div",
    {
        attr: "v1",
        class: "@v2",
        "@click": "handleClick"
    },
    [createElement("span", undefined, [createText("I am the text content")])]
);
```

From the above code, we can see that dynamic directives and event registrations in the attributes are not parsed but are passed intact to the `createElement` method. For development convenience, we will parse these dynamic directives inside the method.

Parameters of the `createElement` method:

| Parameter Name | Description          | Type         | Default Value |
| -------------- | -------------------- | ------------ | ------------- |
| tagName        | Tag name             | string       | -             |
| attr           | Tag attributes       | object       | -             |
| children       | Sub-nodes of the tag | `AST.Node[]` | -             |

Properties of `AST.Element` (inherited from `AST.Node`):

| Property Name | Description    | Type              |
| ------------- | -------------- | ----------------- |
| tagName       | Tag name       | string            |
| children      | Sub-nodes      | `AST.Node[]`      |
| events        | Events         | `AST.Event[]`     |
| attributes    | Tag attributes | `AST.Attribute[]` |

`AST.Event`, as the event type for tags, includes:

| Property Name | Description                                | Type                                                                                                  |
| ------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| name          | Event name                                 | string                                                                                                |
| modifiers     | Event modifiers                            | `Array<string>`. Refer to the description of modifiers in [Event Registration](/base/template-event). |
| functionName  | Name of the event execution function       | string                                                                                                |
| functionParam | Parameters of the event execution function | string                                                                                                |

`AST.Attribute`, as the tag attribute type, includes:

| Property Name | Description                                                                    | Type             |
| ------------- | ------------------------------------------------------------------------------ | ---------------- |
| name          | Attribute name                                                                 | string           |
| value         | Attribute value                                                                | string/undefined |
| express       | If there is a dynamic directive, it is converted into an expression and stored | string/undefined |

### AST.Command (Directive Node)

`AST.Command` is a dynamic directive node responsible for rendering all dynamic values outside of tag attributes. Based on its `cmdName` property, it can be further divided into `IfCommand` (conditional directive), `ForCommand` (loop directive), `SectionCommand` (block directive), and `PropertyOrFunctionCommand` (general dynamic value directive).

First, let's introduce the basic type of these subdivided directives (`AST.Command`), which includes:

| Property Name | Description                                                                       | Type    |
| ------------- | --------------------------------------------------------------------------------- | ------- |
| cmdName       | Directive name                                                                    | string  |
| isGroup       | Whether it is a group. For example, `for`, `if`, etc., which include `{}` subsets | boolean |

These subdivided directives can be created using two methods: `createCommand` and `createCodeFunction`. `createCommand` is used to create group nodes such as `if`, `for`, and `section`, while `createCodeFunction` is used to create **dynamic attributes or methods**.

```ts
createCommand("for", "let item of list", [
    createElement("div", undefined, [
        // Create an @item
        createCodeFunction("item")
    ])
]);
```

Parameters of the `createCommand` function:

| Parameter Name | Description                                                      | Type         | Default Value |
| -------------- | ---------------------------------------------------------------- | ------------ | ------------- |
| cmdName        | Directive name (`if`/`elseif` (no space)/`else`/`for`/`section`) | string       | -             |
| param          | Directive parameters                                             | string       | -             |
| children       | Sub-nodes                                                        | `AST.Node[]` | -             |

The `createCodeFunction` function takes only one parameter, `code` (dynamic expression). As a leaf node, it has no sub-nodes.

When creating nodes using `createCommand`, we will parse the parameter expression internally based on the directive name and convert it into the corresponding AST node type. You can determine the directive type of the current node by checking the `cmdName`.

#### IfCommand

| Property Name | Description            | Type                                                                   |
| ------------- | ---------------------- | ---------------------------------------------------------------------- |
| cmdName       | Directive name         | `'if'`                                                                 |
| kind          | Type of `if` condition | `'if'`/`'elseif'`/`'else'`. Note that there is no space in `'elseif'`. |
| condition     | Condition expression   | string                                                                 |
| children      | Sub-nodes              | `AST.Node[]`                                                           |

#### ForCommand

| Property Name | Description               | Type                                                                                                  |
| ------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| cmdName       | Directive name            | `'for'`                                                                                               |
| keyType       | Loop type                 | `'in'`/`'of'`/`'condition'`, corresponding to `for in`, `for of`, and `conditional loop` respectively |
| param         | Loop parameter expression | `AST.ConditionParam` / `AST.InOrOfParam`                                                              |
| children      | Sub-nodes                 | `AST.Node[]`                                                                                          |

`ConditionParam`, as the parameter type for the conditional loop, includes:

| Property Name | Description                                 | Type   |
| ------------- | ------------------------------------------- | ------ |
| letKey        | Key value of the item, i.e., `let **item**` | string |
| defaultKeyVal | Initial default value of the item           | any    |
| condition     | Condition expression                        | string |
| step          | Step expression                             | string |

`InOrOfParam`, as the parameter type for `for in` and `for of`, includes:

| Property Name | Description                             | Type             |
| ------------- | --------------------------------------- | ---------------- |
| indexKey      | Index key                               | string/undefined |
| itemKey       | Key value of the item                   | string           |
| dataKey       | Expression of the target to be iterated | string           |

#### SectionCommand

| Property Name | Description                | Type         |
| ------------- | -------------------------- | ------------ |
| cmdName       | Directive name             | `'section'`  |
| id            | Block ID                   | string       |
| paramKeys     | Block parameter expression | string       |
| children      | Sub-nodes                  | `AST.Node[]` |

### AST.Component (Dynamic Component Node)

This type does not appear in the parsing result of the `template`. As a node for dynamic components, it is generally used in dynamic `Render` rendering. During the static compilation of **SFC**, avoid using this method. Instead, use the `AST.Element` type and perform different processing at runtime.

```ts
import MyComponent from "./children.joker";

createComponent(
    MyComponent,
    {
        message: "@model.message",
        "@click": "handleClick"
    },
    [
        // Sub-nodes
        createText("I am the text")
    ]
);
```

This method takes three parameters:

| Parameter Name | Description          | Type                                                 | Default Value |
| -------------- | -------------------- | ---------------------------------------------------- | ------------- |
| component      | Component            | `IComponent` / `(new (...arg: any[]) => IComponent)` | -             |
| attrs          | Tag attributes       | object                                               | -             |
| children       | Sub-nodes of the tag | `AST.Node[]`                                         | -             |

From the above introduction, we can see that it is only applicable to rendering components that have been clearly determined. Therefore, it can only be created in JavaScript, not in the `<template>` tag.

Properties of `AST.Component` include:

| Property Name | Description          | Type                                                                                                       |
| ------------- | -------------------- | ---------------------------------------------------------------------------------------------------------- |
| children      | Sub-nodes            | `AST.Node[]`                                                                                               |
| attributes    | Component attributes | `AST.Attribute[]` (refer to the description in `AST.Element`)                                              |
| events        | Component events     | `AST.Event[]` (refer to the description in `AST.Element`)                                                  |
| component     | Component            | `IComponent` / `(new (...arg: any[]) => IComponent)` [Initialized component / Component to be initialized] |
