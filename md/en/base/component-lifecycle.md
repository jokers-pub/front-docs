## Component Lifecycle  

In Joker, the component lifecycle begins when a component class is instantiated and its view along with child views are rendered. This lifecycle involves continuous change detection, where Joker monitors data-bound property changes and updates the views and component instances when necessary. The lifecycle ends when the component instance is destroyed and its rendered template is removed from the DOM. During Joker’s execution, directives also undergo a similar lifecycle during the creation, update, and destruction of component instances.  

Your application can leverage lifecycle hook methods to respond to key events in the lifecycle of a component or directive. These methods can be used to initialize new instances, trigger change detection, handle updates, and perform cleanup operations before an instance is destroyed.  

### Responding to Lifecycle Events  

You can respond to events in the lifecycle of a component or directive by implementing one or more lifecycle hook interfaces defined in the core library. These hook interfaces provide opportunities to operate on the component or directive instance at appropriate moments, such as during creation, update, or destruction.  

Each interface includes a unique hook method. For instance, the `create` hook method—when implemented in a component or directive class—will be called by Joker immediately after checking the input properties of the component or directive for the first time.  

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
        // Triggered after the component is destroyed, serving as the final lifecycle hook  
    }  
}  
```

You don’t need to implement all lifecycle hooks—only those you require.  

### The Order of the Lifecycle  

When your application creates a component instance by calling its constructor, Joker invokes the implemented hook methods according to the phases of the instance’s lifecycle.  

Below is a diagram of the instance lifecycle. You don’t need to fully understand every aspect of it now, but it will serve as a useful reference later.  

![Component Lifecycle](/base/component-life.png)  

### Lifecycle for Components with State Persistence  

In Joker’s default architecture, the mounting and unmounting of a component are one-time events with no state persistence. To address scenarios requiring state preservation, Joker provides the `keep-alive` attribute. This allows a component to **destroy only its DOM nodes** during the `destroy` call, while keeping the component instance alive. When the component is mounted again, it reuses the **surviving instance** to **re-render** the DOM, thereby maintaining the component’s state.  

With the above feature, the lifecycle for such state-persistent components is as follows:  

![Component Lifecycle](/base/keepalive-life.png)  

| Hook Name       | Description                                |  
|-----------------|--------------------------------------------|  
| created         | Triggered when the component is created    |  
| mounted         | Triggered after the component renders and mounts to the DOM |  
| beforeDestroy   | Triggered before the component is destroyed |  
| destroyed       | Triggered after the component is destroyed, serving as the final lifecycle hook |  
| sleeped         | Hook triggered when the component is put to sleep |  
| weakup          | Hook triggered when the component is awakened |  

At this point, you may have many questions. Don’t worry—proceed to the next chapter for further learning. A comprehensive tutorial will fully guide you through Joker’s features.