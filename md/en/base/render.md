## Rendering  

This section aims to delve into the rendering architecture of **Joker Core** and its underlying technical principles.  

### Prerequisites  

Please complete the [template](/base/template) study first.  

Two key terms, **`AST`** and **`VNode`**, will be mentioned later. You can explore them in depth in the following chapters:  
- [AST](/base/ast): Joker Abstract Syntax Tree.  
- [VNode](/base/vnode): Virtual Node Tree, used to render the AST into structured data based on component state.  

### File Splitting  

When developing component templates, Joker provides a standard **HTML tag-based + dynamic directives** development specification. These development-mode templates cannot run directly in browsers as browsers do not natively support Joker’s syntax. During runtime, the `Joker CLI` compiles and transpiles Joker files, splitting SFC (Single File Component) files into three executable files:  

- `*.joker?type=script` – Component class  
- `*.joker?type=template` – Component rendering template  
- `*.joker?type=style` – Component styles  

These three files enable the execution of a component. In production environments, they are merged and minified, whereas in **development (DEV)** mode, they remain separate due to `Joker CLI`'s **ES Module-based** loading mechanism, which compiles on demand. For details, refer to [Joker CLI](/cli).  

### Rendering Template  

After understanding the file-splitting rules, this section focuses on the rendering mechanism of the **Template**.  

Since browsers do not recognize Joker’s syntax, the CLI compiles the `template` content into **AST[]** (Abstract Syntax Tree) during compilation. This AST is then parsed by the **`Parser`** class and the current component instance to generate **`VNode.Node[]`** (Virtual DOM Tree). Once the Virtual DOM Tree is built, the **`Render`** class performs the actual rendering.  

![render](/base/render.png)  

- **`AST.Node[]`**: Converts the template into data that Joker Core can process.  
- **`VNode.Node[]`**: Stores structured rendering output data.  

> The process of converting Joker files into `AST.Node[]` only occurs in the CLI during **DEV** or **Prod** builds. In production, the output consists solely of **JS** and **CSS**, eliminating the template-to-AST transformation.  

When `AST.Node[]` is compiled into `VNode.Node[]`, associations between nodes and reactive data are established. Whenever reactive data changes, the **Parser** updates the virtual nodes, which are then reflected in the DOM. Since the scope of updates is deterministic, this process is **instantaneous** and **highly optimized**.  

Because rendering is instantaneous, changes to reactive data immediately update the DOM, allowing real-time access to modified DOM nodes.  

!!!demo1!!!  

:::warning  
If reactive data is modified multiple times in a tight loop, the DOM will also update repeatedly, incurring unnecessary performance overhead. In such cases, use [Batch Updates](/base/combined-reply) to consolidate changes for a single render pass.  
:::  

### Cross-Platform / Multi-Target Rendering (Advanced API)  

The **Render** class is pluggable. By default, Joker Core includes `HTML Render`, which compiles **`VNode.Node[]`** into **DOM Nodes**.  

You can also **customize the Renderer** to target different platforms:  
```ts
import { IContainer, Render } from "@joker.front/core";

// Inject your custom implementation  
IContainer.bind(Render.IRENDERIOCTAGID, YourCustomRenderer);
```  

Your custom renderer must implement the **`Render.IRender`** interface:  
```ts
export interface IRender {
    /**
     * Mounts the renderer to a root target.
     * @param root - The mounting root (type-agnostic for multi-platform compatibility)
     */
    mount(root: any): void;

    /**
     * Appends a node to the render tree.
     * @param node - NodeInfo
     */
    appendNode(node: VNode.Node): void;

    /**
     * Updates a node.
     * @param node - NodeInfo
     * @param propertyKey - Optional property to update
     */
    updateNode(node: VNode.Node, propertyKey?: string): void;

    /**
     * Removes a node.
     * @param node - The node to remove
     * @param reserveOutPut - Whether to retain the output
     */
    removeNode(node: VNode.Node, reserveOutPut?: boolean): void;

    /**
     * Destroys the renderer, unmounting DOM and releasing resources.
     */
    destroy(): void;

    /**
     * Triggers a transition (enter) on an element node.
     */
    elementToEnter(node: VNode.Element, name: string, type?: TransitionType, callBack?: Function): void;

    /**
     * Triggers a transition (leave) on an element node.
     */
    elementToLeave(node: VNode.Element, name: string, type?: TransitionType, callBack?: Function): void;

    /**
     * Dispatches a component event.
     * @returns `false` stops event propagation.
     */
    triggerEvent(node: VNode.Component, eventName: string, e: VNode.Event): void | false;
}
```  

Joker will continue expanding support for mainstream platforms, including **native clients** and **mini-programs**.