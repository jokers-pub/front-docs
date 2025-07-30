## Component Lifecycle

In Joker, the lifecycle of a component begins when the component class is instantiated and its view and sub-views are rendered. This lifecycle is accompanied by continuous change detection. Joker monitors changes in data-bound properties and updates the view and component instance when necessary. The lifecycle ends when the component instance is destroyed and its rendered template is removed from the DOM. During the execution of Joker, directives also go through a similar lifecycle when component instances are created, updated, and destroyed.

Your application can utilize lifecycle hook methods to respond to key events in the lifecycle of a component or directive. These methods can be used to initialize a new instance, start change detection, respond to updates, and perform cleanup operations before the instance is destroyed.

### Responding to Lifecycle Events

You can respond to events in the lifecycle of a component or directive by implementing one or more lifecycle hook interfaces defined in the core library. These hook interfaces provide you with the opportunity to operate on the component or directive instance at the appropriate time, such as when creating, updating, or destroying the instance.

Each interface contains a unique hook method. For example, the `create` hook function. If this method is implemented in a component or directive class, Joker will call this method immediately after the first check of the input properties of the component or directive.

```ts
import { Component } from "@joker.front/core";

export default class extends Component {
    created() {
        // Triggered when the component is created
    }

    mounted() {
        // Triggered after the component is rendered and mounted to the DOM
    }

    destroyed() {
        // Triggered after the component is destroyed, as the last hook function in the lifecycle
    }
}
```

You don't have to implement all the lifecycle hooks, just the ones you need.

### Lifecycle Order

When your application creates a component instance by calling the constructor, Joker will call the corresponding implemented hook methods according to the stages of the instance's lifecycle.

The following is a diagram of the instance lifecycle. You don't need to fully understand everything in the diagram now, but it will be a useful reference later.

![Component Lifecycle](/base/component-life.png)

### Lifecycle for Components that Need to Maintain State

Under the default Joker system, the mounting and unmounting of a component are one-time operations, and there is no state preservation. To meet the need for component state preservation, Joker provides the `keep-alive` property. When a component calls `destroy` with this property, **only the DOM nodes are destroyed**, and the component instance is not destroyed. When the component is mounted again, the **surviving instance** will be used to **render** the DOM again, achieving component state preservation.

Based on the above introduction, the lifecycle of such a state-maintaining component is as follows:

![Component Lifecycle](/base/keepalive-life.png)

| Function Name | Introduction                                                                           |
| ------------- | -------------------------------------------------------------------------------------- |
| created       | Triggered after the component is created                                               |
| mounted       | Triggered after the component is rendered and mounted to the DOM                       |
| beforeDestroy | Triggered before the component is destroyed                                            |
| destroyed     | Triggered after the component is destroyed, as the last hook function in the lifecycle |
| sleeped       | Hook function after the component is put to sleep                                      |
| weakup        | Hook function triggered after the component is awakened                                |

You may have a lot of questions at this point. Don't worry, please continue to study the next chapter. There will be a complete tutorial at the end to let us comprehensively understand Joker.
