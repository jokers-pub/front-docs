## AST Syntax Tree

This chapter introduces the Abstract Syntax Tree (AST) in Joker's template.

### Overview

AST is the structured data representation of templates in Joker, which will eventually combine with component instances to render virtual Nodes and display them on the target platform.

There are two sources of AST:
1. Written in the `<template>` tag of **Single File Components (SFC)** using template syntax rules (see [Template](/base/template)), then converted to `AST.Node[]` through the **CLI**.
2. Generated via JS syntax using Core methods like `createText` and `createCommand`, then assigned to the component's `template` property. (Refer to the `template` property in [Component Properties](/base/component-property) for details.)

Both methods produce `AST.Node[]`, where AST.Node serves as the base model class divided into four functional types: `Text`, `Element`, `Comment`, and `Component`. The base AST.Node has the following properties:

| Property | Description | Type |
|----------|-------------|------|
| childrens | Child nodes | AST.Node[] |
| type     | Node type   | NodeType |

Use the `type` field to determine the specific AST.Node type:
```ts
// This enum can be obtained via AST.NodeType
export enum NodeType {
    TEXT,     // Text
    COMMENT,  // Comment
    ELEMENT,  // HTML tag
    COMMAND,  // Directive
    COMPONENT // Dynamic component
}

// Example:
item.type === AST.NodeType.COMMENT;
```

### AST.Text (Text Node)

AST.Text represents static text content in a template.

Example:
```html
<p>I am content</p>
```
Here, the content inside the `<p>` tag is an AST.Text.

Alternatively, use Core's `createText` method to create a static text node (takes a single parameter, the text value):
```ts
import { Component, createText } from "@joker.front/core";

export default class extends Component {
    template = () => {
        return [createText("I am content")];
    };
}
```
This returns an `AST.Text` object with a `text` property storing the static content. As a leaf node in the AST, it contains no children.

### AST.Comment (Comment Node)

AST.Comment represents HTML comment nodes in templates. Example:
```html
<!--I am a comment-->
```
Alternatively, use `createComment` to generate a comment node:
```ts
import { Component, createComment } from "@joker.front/core";

export default class extends Component {
    template = () => {
        return [createComment("I am a comment")];
    };
}
```
This returns an `AST.Comment` object with a `text` property storing the comment. As a leaf node, it has no children.

> In production builds, AST.Comment nodes are stripped by default to minimize output size.

### AST.Element (Tag Node)

AST.Element represents HTML tags (e.g., `div`, `span`) or component names. During AST compilation, Core cannot determine if a tag refers to a component—this is resolved during runtime based on component registrations.

![AST-Element](/base/ast-element.png)

Example HTML and equivalent `createElement` usage:
```html
<div attr="v1" class="@v2" @click="handleClick">
    <span>I am content</span>
</div>
```
```ts
createElement(
    "div",
    {
        attr: "v1",
        class: "@v2",
        "@click": "handleClick"
    },
    [createElement("span", undefined, [createText("I am content")])]
);
```
Attributes like dynamic directives and events are passed as-is; parsing occurs internally.

#### `createElement` Parameters:
| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| tagName   | Tag name    | string | - |
| attr      | Attributes  | object | - |
| children  | Child nodes | AST.Node[] | - |

#### AST.Element Properties (inherits from AST.Node):
| Property   | Description | Type |
|------------|-------------|------|
| tagName    | Tag name    | string |
| childrens  | Children    | AST.Node[] |
| events     | Events      | AST.Event[] |
| attributes | Attributes  | AST.Attribute[] |

#### AST.Event Structure:
| Property       | Description | Type |
|----------------|-------------|------|
| name           | Event name  | string |
| modifiers      | Modifiers   | string[] (see [Event Handling](/base/template-event)) |
| functionName   | Handler name| string |
| functionParam  | Handler args| string |

#### AST.Attribute Structure:
| Property | Description | Type |
|----------|-------------|------|
| name     | Attribute name | string |
| value    | Static value | string \| undefined |
| express  | Dynamic expression | string \| undefined |

### AST.Command (Directive Node)

AST.Command handles dynamic directives, categorized into:
- `IfCommand` (conditional)
- `ForCommand` (loop)
- `SectionCommand` (block)
- `PropertyOrFunctionCommand` (dynamic value)

Base AST.Command properties:
| Property | Description | Type |
|----------|-------------|------|
| cmdName  | Directive name | string |
| isGroup  | Whether it's a group (e.g., `if/for` with `{}`) | boolean |

Use `createCommand` for group nodes (if/for/section) and `createCodeFunction` for dynamic values:
```ts
createCommand("for", "let item of list", [
    createElement("div", undefined, [
        createCodeFunction("item") // Dynamic value
    ])
]);
```

#### `createCommand` Parameters:
| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| cmdName   | Directive name (`if`/`elseif`/`else`/`for`/`section`) | string | - |
| param     | Directive parameters | string | - |
| childrens | Children  | AST.Node[] | - |

#### Command Subtypes:
1. **IfCommand**:
   | Property | Description | Type |
   |----------|-------------|------|
   | cmdName  | `if` | string |
   | kind     | `if`/`elseif`/`else` | string |
   | condition | Condition expression | string |

2. **ForCommand**:
   | Property | Description | Type |
   |----------|-------------|------|
   | cmdName  | `for` | string |
   | keyType  | `in`/`of`/`condition` | string |
   | param    | Loop parameters | `AST.ConditionParam` \| `AST.InOrOfParam` |

   - `ConditionParam` (conditional loops):
     | Property | Description | Type |
     |----------|-------------|------|
     | letKey   | Item key (e.g., `let item`) | string |
     | defaultKeyVal | Default value | any |
     | condition | Condition | string |
     | step     | Step expression | string |

   - `InOrOfParam` (`for in`/`for of`):
     | Property | Description | Type |
     |----------|-------------|------|
     | indexKey | Index key | string \| undefined |
     | itemKey  | Item key | string |
     | dataKey  | Target expression to iterate | string |

3. **SectionCommand**:
   | Property | Description | Type |
   |----------|-------------|------|
   | cmdName  | `section` | string |
   | id       | Block ID | string |
   | paramKeys | Block parameters | string |

### AST.Component (Dynamic Component)

This type does not appear in SFC template parsing. It's used exclusively for dynamic rendering via JS (e.g., `createComponent`). Static templates should use `AST.Element`.

Example:
```ts
import MyComponent from "./children.joker";

createComponent(
    MyComponent,
    {
        message: "@model.message",
        "@click": "handleClick"
    },
    [createText("I am text")] // Children
);
```

#### `createComponent` Parameters:
| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| component | Component class/instance | `IComponent` \| `(new (...args: any[]) => IComponent)` | - |
| attrs     | Attributes | object | - |
| children  | Children | AST.Node[] | - |

#### AST.Component Properties:
| Property | Description | Type |
|----------|-------------|------|
| childrens  | Children | AST.Node[] |
| attributes | Component props | AST.Attribute[] |
| events    | Component events | AST.Event[] |
| component | Component reference | `IComponent` \| `(new (...args: any[]) => IComponent)` |