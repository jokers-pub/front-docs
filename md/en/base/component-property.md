## Component Properties  

Our component development is based on the powerful library `@('@joker.front/core')`. It provides developers with a series of tools and APIs, including lifecycle hooks, API functions, and properties, which help us develop components more efficiently and conveniently. In this section, we will delve into the composition of a component class, allowing you to understand how to leverage this library to create feature-rich, high-performance components.  

Joker provides some default properties and property specification standards. This section mainly introduces these properties to help us better utilize them during development.  

### Component Props (props / propsOption)  

In parent components, parameters can be passed to child components. Child components specify parameter types using TypeScript generics and can use `propsOption` to set constraints or default values for these parameters.  

```ts
import { Component } from "@joker.front/core";

export default class extends Component<{
    message: string;
    checked: boolean;
    money: number;
}> {}
```  

The above code example shows that the current component will receive three parameters with their types specified.  

> It is worth noting that Joker imposes weak constraints on component parameters to maintain maximum flexibility. The generic types defined serve only as quick hints within the component and do not perform value conversion, null checks, or other operations.  

However, if your component requires constraints, default values, or type enforcement for parameters, we also provide `propsOption` for configuration.  

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
            //Required parameter  
            required: true,  
            //Type  
            type: [String, Number],  
            //Validation  
            validate(val: any) {  
                let value = parseInt(val);  
                if (isNaN(value)) {  
                    console.error("Please enter a valid type for 'money'");  
                    return false;  
                }  
                return true;  
            }  
        },  
        message: "I am the default message",  
        age: Boolean,  
        zIndex: 1  
    };  
}  
```  

The example above demonstrates the rich capabilities of `propsOption`. Its rules are as follows:  

1. If the value is `String | ArrayConstructor | Number | Object | Function | Boolean` or an array of these types, it enforces the parameter's type. When retrieving the value, it attempts conversion to the first default type and logs an error if the conversion fails.  

2. If the value is an object containing any of the properties `type`, `required`, `default`, or `validate`, it treats all properties as parameter constraints.  
   Full property specifications (all optional):  
   | Property | Description | Type |  
   |-|-|-|  
   | type | Value type | String / Array / Number / Object / Function / Boolean, or an array of these types |  
   | required | Whether the parameter is required | boolean |  
   | default | Default value | any |  
   | validate | Value validation method | (val: any) => boolean |  

3. If none of the above conditions are met, the value is treated as the default parameter value. When the parameter is **undefined**, this default value is returned.  

The above content explains how to define a component's parameters and their constraints. Next, let's see how to read these parameters.  

```ts
let money = this.props.money;  
```  

The defined parameters can be accessed via the `props` object. Note that this property is read-only and cannot be redefined or assigned new values.  

When handling parameter passing, we typically operate based on element tags. To maintain naming consistency and standardization, property names may use **camelCase** or **hyphen-separated** formats. To better accommodate different parameter naming conventions, we adopt the following strategy when reading parameters: First, attempt to retrieve the parameter using the original key name. If unsuccessful, attempt to convert the **first letter of each word to uppercase**, then to lowercase, and concatenate them with `-` as the key. For example:  

```html
<my-component success-message="I am a success message" errorMessage="I am an error message" />  
```  

In the component, these values can be accessed in the following ways, all of which are valid:  

```ts
this.props.successMessage;  
this.props["success-message"];  
this.props.errorMessage;  
```  

Joker further optimizes boolean handling internally. To avoid redundant operations like `checked="@('@true')"` in tags, when a property is defined but not assigned a value (note: not **undefined**, but without `=`), it is treated as **true**. For example:  

```html
<my-component checked />  
```  

For more template syntax, refer to the [Template](/base/template) section.  

`props` data is reactive. When external values change, corresponding notifications are triggered:  

!!!demo1!!!  

Child component code:  

```html
<template> I am the child component. Your current input: @props.message </template>  
<script>  
    import { Component } from "@joker.front/core";  

    export default class extends Component<{  
        message: string  
    }> {}  
</script>  
```  

### Reactive Data (model)  

Joker provides the [observer](/base/observer) method for data interception. However, to help developers quickly define reactive data within components, we offer the `model` property by default. This property is intercepted before mounting and provides reactive data capabilities.  

```ts
export default class extends Component {  
    model = {  
        value: ""  
    };  
}  
```  

Alternatively, you can use the `observer` method to define reactive data:  

```ts
export default class extends Component {  
    list = observer({  
        value: ""  
    });  

    created() {  
        this.$watch(  
            () => this.list,  
            () => {  
                //Value changed  
            }  
        );  
    }  
}  
```  

Since we use TypeScript standards, when the `model` property's type is complex, we can use `as` to specify the type for a property. For example:  

```ts
export default class extends Component {  
    model: {  
        value?: { key: string; value: number };  
    } = {  
        value: undefined  
    };  
}  
//Equivalent to 👇👇👇 More convenient for complex or multiple properties  
export default class extends Component {  
    model = {  
        value: undefined as { key: string; value: number } | undefined,  
        message: ""  
    };  
}  
```  

> Note: We recommend storing only reactive, observable data in `model`. Temporary data can be directly defined as properties within the component class to reduce reactive data overhead.  

### Rendering Template (template)  

In addition to defining templates using the `template` tag in SFC mode, we can also use the `template` property to define templates. This allows us to create more complex rendering templates using JavaScript logic.  

```html
<script>  
    import { Component, createElement, createText } from "@joker.front/core";  
    export default class extends Component {  
        template = function () {  
            let children = [];  
            if (__DEV__) {  
                children.push(createText("Content created via createText"));  
            }  
            return [createElement("div", undefined, children)];  
        };  
    }  
</script>  
```  

!!!demo2!!!  

### Private Components (component)  

Use the `component` property to configure private components within the current component. For component registration mechanisms, see [Component Registration](/base/component-register).  

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

Component registration supports asynchronous loading. Use `() => import('component.joker')` for asynchronous component references. Asynchronous components are not loaded during parent component initialization but are loaded only when the component needs to be rendered. For example:  

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

From the above code and console output (network), you can see that asynchronous components are loaded only when required.  

### Root Node ($root / $rootVNode)  

During rendering, every tag/component/directive exists as a tree structure, and components are no exception. We can use `$root` and `$rootVNode` to access a component's container or root node.  

- `$root`: Represents the component's mounting container. It is specified when the container is mounted (`$mount`) and can be an HTML `Element` or a `VNode.Component`.  

- `$rootVNode`: Represents the component's top-level node, always of type `VNode.Root`. Since rendering templates can have multiple top-level tags, they must be wrapped by a `VNode.Root`. This property is created during template rendering and is not available in the `created` lifecycle hook.  

For example, to retrieve all `Element` nodes in the current component:  

```html
<template>  
    <div>1</div>  
    <div>2</div>  
    <div>3</div>  
</template>  

<script>  
    //...  
    //Get all Element nodes  
    this.$rootVNode?.find((n) => n instanceof VNode.Element);  

    //Search upward for the nearest Element node  
    this.$rootVNode?.closest((n) => n instanceof VNode.Element);  

    //...  
</script>  
```  

For more details on `VNode.Root`, refer to [Virtual Nodes](/base/vnode).  

### All Tagged Nodes ($refs)  

This read-only property stores all tagged nodes. Its values synchronize when nodes are added or destroyed (value synchronization, not reactive data; use `$watchNode` API for observation).  

```ts
let count = this.$refs.refName?.count;  
```  

Alternatively, use `$getRef` and `$getRefs` methods to locate tagged nodes. These methods support TypeScript generics to specify output types for easier manipulation. Refer to [Component Built-in Methods](/base/component-api).  

### Is Keep Alive (isKeepAlive)  

This property determines whether the component should maintain its state. Components marked for keep-alive will only destroy their mounted element nodes during `$destroy`, not the entire component instance. For details, see [Component Lifecycle](/base/component-lifecycle).  

Component call with `keep-alive`:  

```html
<template>  
    <MyComponent keep-alive />  
</template>  
```  

In the child component, use **isKeepAlive** to determine whether the component should maintain its state during rendering.  

```ts
export class extends Component {  
    created() {  
        if (this.isKeepAlive) {  
            //TODO:...  
        }  
    }  
}  
```  

### Is Sleeping (isSleeped)  

When a component is marked for keep-alive, only the mounted element nodes are destroyed during `$destroy`, not the entire component instance. For details, see [Component Lifecycle](/base/component-lifecycle).  
Use this property to check the component's current state, for example:  

```ts
export class extends Component {  
    //Timer trigger function  
    testMethod() {  
        //Ignore execution if the component is sleeping.  
        if (this.isSleeped) return;  

        MessageBox.alert("Timer triggered.");  
    }  
}  
```  

### Rendering Sections ($sections)  

This read-only property represents the sections to be rendered within the component. For usage, see [Section Rendering](/base/template-section).  

```ts
class extends Component {  
    myFunction() {  
        if (this.$sections.top) {  
            //A top section template was passed  
        } else {  
            //No top section template was passed  
        }  
    }  
}  
```  

This property is of object type, where `key` represents the section name and `value` represents the section data object. Its detailed type (`SectionType`) is as follows:  

| Property | Description                                                                                                     | Type           |  
|----------|-----------------------------------------------------------------------------------------------------------------|----------------|  
| asts     | AST tree. See [AST](/base/ast) for details.                                                                     | AST.Node[]     |  
| ob       | The data object (`ob`) required for rendering the template.                                                     | Object         |  
| parser   | The parser object (`ParserTemplate`) where the template is rendered.                                            | ParserTemplate |  
| params   | Parameters. Refer to the section parameters in [Section Rendering](/base/template-section). This property refers to **parameter names**, not **values**. | string[]       |  

> This property is read-only. Modifying its values is not recommended, as they are generated internally by Core.