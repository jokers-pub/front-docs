## Rendering

This section aims to deeply explore the rendering processing architecture of Joker Core and the technical principles behind it.

### Prerequisites

Please complete the learning of [template](/base/template) first.

Two keywords, `AST` and `VNode`, will be mentioned in the following text. We can have an in-depth understanding in the subsequent chapters:

-   [AST](/base/ast) Joker syntax tree.

-   [VNode](/base/vnode) Virtual node tree, used to render the AST syntax tree into structured data according to component data.

### File Splitting

When developing component templates, Joker provides a development specification of standard HTML tags plus dynamic directives. This development-stage code will not run directly in the browser because the browser does not support the development specification provided by Joker. During runtime, we use the compilation of `Joker CLI` to transcribe the Joker files. The SFC file is split into three files that can be executed by the browser:

-   `*.joker?type=script` Component class
-   `*.joker?type=template` Component rendering template
-   `*,joker?type=style` Component style

A component runs through these three files. Of course, in the actual production environment, these three files will be merged and compressed. Only in the development (DEV) environment will these three file types appear. This is because `Joker CLI` adopts the `ES Module` loading mechanism, which compiles and runs on-demand. For detailed content, please refer to [Joker CLI](/cli).

### Rendering Template

By understanding the file-splitting rules, this section mainly introduces the rendering mechanism of `template`.

Since the browser does not recognize Joker's syntax, during compilation, the `template` content will be compiled and converted by the CLI into an `AST[]` syntax tree. When the component needs to be loaded, these syntax trees will be compiled into a `VNode.Node[]` virtual DOM tree through the `Parser` parsing class and the instance of the current component. After the entire virtual DOM tree is constructed, the actual rendering will be done through the `Render` rendering class.

![render](/base/render.png)

-   `AST.Node[]` is used to convert the `template` into data that can be recognized by Joker Core.

-   `VNode.Node[]` is used to store the structured data output by the current rendering.

> The process of converting a Joker file into `AST.Node[]` only occurs in the `DEV` and `Prod` CLI processes. After the actual production build, the output only contains JS and CSS, and there is no longer a process of parsing the template into an AST.

When `AST.Node[]` is compiled into `VNode.Node[]`, the relationship between the current node and the reactive data will be associated. When the reactive data changes, the virtual node will be updated through the **Parser** rendering class, and then the virtual node will be updated to the DOM. Since the update range of a single change is fixed, this process is **instantaneous** and the performance is optimal.

Since page rendering is `instantaneous`, it means that when we change the value through reactive data, we can immediately obtain the updated DOM node data.

!!!demo1!!!

:::warning
When we need to frequently change reactive data within a code logic, the DOM will also be updated multiple times, which will bring unnecessary performance overhead. In this case, you can use [Combined Reply](/base/combined-reply) to achieve grouped and one-time rendering.
:::

### Cross-Platform/One-Code-for-Multiple-Ends [High-Order API]

The `Render` rendering class is pluggable. Currently, Joker Core internally inherits the `HTML Render` implementation class by default, which can compile `VNode.Node[]` into `DOM Node`.

You can also customize the `Render` to achieve the result output of the target platform:

```ts
import { IContainer, Render } from "@joker.front/core";

// Inject your implementation class
IContainer.bind(Render.IRENDERIOCTAGID, YourImplementationClass);
```

Your implementation class needs to implement all the properties of the `Render.IRender` interface.

```ts
export interface IRender {
    /**
     * Mount
     * @param root Mounting root
     * The type of root is not restricted for multi-end compatibility in the future
     */
    mount(root: any): void;

    /**
     * Append a node
     * @param node NodeInfo
     */
    appendNode(node: VNode.Node): void;

    /**
     * Update a node
     * @param node NodeInfo
     * @param propertyKey Name of the updated property
     */
    updateNode(node: VNode.Node, propertyKey?: string): void;

    /**
     * Remove a node
     * @param {VNode.Node} node
     * @param {VNode.Node} parent If empty, it represents the children of the root node
     * @param {boolean} reserveOutPut Whether to retain the out product
     */
    removeNode(node: VNode.Node, reserveOutPut?: boolean): void;

    /**
     * Destroy, unmount the DOM and release variables
     */
    destroy(): void;

    /**
     * element node transition enter
     */
    elementToEnter(node: VNode.Element, name: string, type?: TransitionType, callBack?: Function): void;

    /**
     * element node transition leave
     */
    elementToLeave(node: VNode.Element, name: string, type?: TransitionType, callBack?: Function): void;

    /**
     * Trigger a component event
     * @param node
     * @param eventName
     * @returns false means stop broadcasting
     */
    triggerEvent(node: VNode.Component, eventName: string, e: VNode.Event): void | false;
}
```

Joker will continuously improve the output docking of mainstream market platforms in the future, including native clients, mini-programs, etc.
