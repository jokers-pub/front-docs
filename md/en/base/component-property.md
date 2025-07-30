## Component Attributes

Our component development is based on the powerful library `@('@joker.front/core')`. It provides developers with a series of tools and APIs, including lifecycle hook functions, API functions, and attributes, which can help us complete component development more efficiently and conveniently. In this chapter, we will delve into the composition of a component class, enabling you to understand how to utilize this library to create a component with rich functionality and superior performance.

Joker provides some default attributes and attribute specification standards by default. This chapter mainly introduces these attributes to facilitate our better use of them during the development process.

### Component Parameters (props / propsOption)

Parameters can be passed from the parent component to the child component. The child component uses TypeScript generics to specify the parameter types for the component, and `propsOption` can be used to set some constraints or default values for the parameters.

```ts
import { Component } from "@joker.front/core";

export default class extends Component<{
    message: string;
    checked: boolean;
    money: number;
}> {}
```

As can be seen from the above code example, the current component will receive three parameters and specify the types of the three parameters.

> It should be noted that, in order to maintain maximum flexibility, Joker has weak constraints on component parameters. The defined generic types only exist as quick hints within the component and will not perform operations such as value conversion or non-null judgment.

Of course, if your component has requirements for parameter constraints, default values, and type enforcement, we also provide `propsOption` for configuration.

```ts
import { Component } from "@joker.front/core";

export default class extends Component<{
    message: string;
    age: number;
    money: number;
    zIndex: number;
}> {
    propsOption = {
        money: {
            // Required parameter
            required: true,
            // Type
            type: [String, Number],
            // Validation
            validate(val: any) {
                let value = parseInt(val);
                if (isNaN(value)) {
                    console.error("money should be of the correct type");
                    return false;
                }
                return true;
            }
        },
        message: "This is the default prompt",
        age: Boolean,
        zIndex: 1
    };
}
```

From the above example, it can be seen that `propsOption` supports rich usage. Its rules are as follows:

1. If it is `String | ArrayConstructor | Number | Object | Function | Boolean` or `Array<above types>`, it represents constraining the type of the value, and when retrieving the value, it will attempt to convert it according to the first default type. An error will be reported if the conversion fails.

2. If it is an object, and the object includes any of the properties `type`/`required`/`default`/`validate`, then the entire set of properties is used as parameter constraints.
   Explanation of full-type parameters (all properties are optional):
   | Property Name | Description | Type |
   |-|-|-|
   | type | Value type | `String / Array/ Number / Object / Function / Boolean` or an array of the above types `[above types]` |
   | required | Whether it is a required item | `boolean` |
   | default | Default value | `any` |
   | validate | Value validation method | `(val:any)=>boolean` |

3. If it does not meet the above conditions, then the value is used as the default value of the parameter. When the parameter is **undefined**, this default value is returned.

From the above content, we can understand how to define the parameters of the current component and their constraints. Next, let's take a look at how to read the parameters.

```ts
let money = this.props.money;
```

The parameters we defined can be obtained through the `props` object. It should be noted that this property is a read-only property and does not allow re-definition or setting of a new value.

When handling parameter passing, we usually operate based on element tags. To maintain naming consistency and standardization, attribute names may use `camelCase` or be separated by `-`. To better accommodate multiple parameter naming standards, when reading parameters, we will adopt the following strategy: First, try to obtain the parameter directly using the original key name. If that fails, then we will try to convert each word to lowercase after capitalizing the first letter, split them, and connect them with `-` as the key, and then try to obtain the parameter again. This processing method ensures that we can flexibly adapt to different naming rules.

For example:

```html
<my-component success-message="This is the success prompt" errorMessage="This is the error prompt" />
```

Then, in the component, the values can be retrieved in the following ways, all of which are allowed.

```ts
this.props.successMessage;
this.props["success-message"];
this.props.errorMessage;
```

Joker has further optimized for booleans internally. To avoid redundant operations like `checked="@('@true')"` in the tag, when we encounter an attribute that is defined but has no configured value (note that it is not `undefined`, but there is no `=`), it is treated as `true` by default. For example:

```html
<my-component checked />
```

For more template syntax, you can have an in-depth understanding by reading [Template](/base/template).

The data in `props` is reactive data. When the external value changes, a synchronous notification will also be sent:

!!!demo1!!!

Code of the child component:

```html
<template>I'm the child component, the content you entered currently: @props.message</template>
<script>
    import { Component } from "@joker.front/core";

    export default class extends Component<{
        message: string
    }> {}
</script>
```

### Reactive Data (model)

Joker internally provides a data hijacking method [observer](/base/observer). However, to facilitate developers to quickly define reactive data within components, we provide the `model` attribute by default. This attribute will be hijacked before the loading starts and provides the ability for data reactivity.

```ts
export default class extends Component {
    model = {
        value: ""
    };
}
```

Of course, you can also use the `observer` method to define a reactive data.

```ts
export default class extends Component {
    list = observer({
        value: ""
    });

    created() {
        this.$watch(
            () => this.list,
            () => {
                // The value has changed
            }
        );
    }
}
```

Since we are using the `TypeScript` standard, when the type of the `model` attribute is too complex, we can use the `as` method to specify the type for a certain attribute. For example:

```ts
export default class extends Component {
    model: {
        value?: { key: string; value: number };
    } = {
        value: undefined
    };
}
// Equivalent to👇👇👇 which is more convenient for complex attributes or multiple attributes
export default class extends Component {
    model = {
        value: undefined as { key: string; value: number } | undefined,
        message: ""
    };
}
```

> Note that we recommend storing only the reactive observable data in `model`. For temporary data, it can be directly configured as an attribute within the component class to reduce the overhead of reactive data.

### Render Template (template)

In addition to using the `template` tag in the `SFC` mode to define the template, we can also define the template through the `template` attribute. The advantage of this is that we can create a more complex render template through JavaScript judgment.

```html
<script>
    import { Component, createElement, createText } from "@joker.front/core";
    export default class extends Component {
        template = function () {
            let children = [];
            if (__DEV__) {
                children.push(createText("This is the content created by createText"));
            }
            return [createElement("div", undefined, children)];
        };
    }
</script>
```

!!!demo2!!!

### Private Components (component)

Configure the private components within the current component by configuring the `component` attribute. For the component registration mechanism, please refer to [Component Registration](/base/component-register).

```html
<template>
    <MyComponent />
    <MyAsyncComponent />
</template>
<script>
    import { Component } from "@joker.front/core";
    import MyComponent from "./children.joker";
    export default class extends Component {
        component = {
            MyComponent,
            MyAsyncComponent: () => import("./async-children.joker")
        };
    }
</script>
```

!!!demo3!!!

Component registration supports asynchronous operations. You can use the method `()=>import('component.joker')` for asynchronous component references. Asynchronous reference components will not be loaded along with the initialization of the parent component, but will be loaded only when the component needs to be rendered. For example:

```html
<template>
    @if(false){
    <MyAsyncComponent />
    }
</template>
<script>
    import { Component } from "@joker.front/core";

    export default class extends Component {
        component = {
            MyAsyncComponent: () => import("./async-children.joker")
        };
    }
</script>
```

!!!demo4!!!

From the above code and the console output (network), it can be seen that the asynchronous component will be loaded only when it is required to be loaded.

### Root Node ($root / $rootVNode)

During rendering, every tag/component/directive exists in a tree-like structure, and components are no exception. We can obtain the mounting container/root node of a component by calling the two attributes `$root` and `$rootVNode`.

So how do we distinguish between `$root` and `$rootVNode`?

-   `$root` represents the mounting container of the current component. It is passed as a parameter and specified when the container is mounted ($mount). It can be an HTML `Element` or a `VNode.Component`.

-   `$rootVNode` is the top-level node of the current component, and its type must be `VNode.Root`. Since our render template does not limit the number of top-level tags, it must be wrapped by a `VNode.Root`. Through this property, we can perform operations such as looking up nodes downward. The value of this property will be created only when the template is rendered, so the value of this property cannot be obtained within the `created` lifecycle.

For example, if we want to obtain all `Element` nodes of the current component

```html
<template>
    <div>1</div>
    <div>2</div>
    <div>3</div>
</template>

<script>
    //...
    // Get all element nodes
    this.$rootVNode?.find((n) => n instanceof VNode.Element);

    // Look up and find the nearest element node
    this.$rootVNode?.closest((n) => n instanceof VNode.Element);

    //...
</script>
```

For knowledge related to `VNode.Root`, you can click [Virtual Node](/base/vnode) to learn more.

### All Marked Nodes ($refs)

This property stores all marked nodes. This property is a read-only property. When nodes are added or destroyed, the value of this property will be synchronized accordingly (value synchronization, not reactive data. If you want to observe, it is recommended to use the `$watchNode` API).

```ts
let count = this.$refs.refName?.count;
```

Of course, you can also call the `$getRef` and `$getRefs` methods to find marked nodes. These two methods can use TypeScript generic classes to specify the output type, which is more convenient for operation. [Component Built-in Methods](/base/component-api)

### Whether to Maintain State (isKeepAlive)

We can determine whether a component is required to maintain its state through this property. For components that are required to maintain their state, only the mounted element nodes will be destroyed during `$destroy`, rather than the entire component instance. For details, you can refer to [Component Lifecycle](/base/component-lifecycle).

Call the component and configure `keep-alive`:

```html
<template>
    <MyComponent keep-alive />
</template>
```

In the child component, we can determine whether the current component rendering requires state maintenance through **isKeepAlive**.

```ts
export class extends Component {
    created() {
        if (this.isKeepAlive) {
            //TODO:...
        }
    }
}
```

### Whether it is in Sleep State (isSleeped)

When a component is required to maintain its state, only the mounted element nodes will be destroyed during `$destroy`, rather than the entire component instance. For details, you can refer to [Component Lifecycle](/base/component-lifecycle).
We can use this property to determine the current state of the component. For example:

```ts
export class extends Component {
    // Timed task trigger function
    testMethod() {
        // Ignore the timed execution when the component is asleep.
        if (this.isSleeped) return;

        MessageBox.alert("The timer has been triggered.");
    }
}
```

### Render Sections ($sections)

This property is a read-only property representing the sections to be rendered passed into the current component. For usage, please refer to [Section Rendering](/base/template-section).

```ts
class extends Component {
    myFunction() {
        if (this.$sections.top) {
            // The top section template has been passed in
        } else {
            // The top section template has not been passed in
        }
    }
}
```

The type of this property is an object type, where the `key` represents the section name, and the `value` represents the object data of the section to be rendered. Its detailed type is as follows (`SectionType`):

| Property Name | Description                                                                                                                                                                                               | Type             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| asts          | AST tree, which can be understood by referring to [AST](/base/ast)                                                                                                                                        | `AST.Node[]`     |
| ob            | The data object (ob) required for rendering this template                                                                                                                                                 | `Object`         |
| parser        | The parser object where this template is rendered                                                                                                                                                         | `ParserTemplate` |
| params        | Parameters, which can be referred to in the section parameter chapter of [Section Rendering](/base/template-section). This property **does not represent the parameter value** but **the parameter name** | `string[]`       |

> This property is a read-only property. It is not recommended to modify the value of this property. The property value is generated internally by Core.
