## 渲染

本节旨在深入探讨 Joker Core 的渲染处理架构及其背后的技术原理。

### 前提条件

请先完成 [template](/base/template) 的学习。

下文中会提到`AST`和`VNode`两个关键词，我们可以在后面的章节去深入了解：

-   [AST](/base/ast) Joker 语法树。

-   [VNode](/base/vnode) 虚拟节点树，用于将 AST 语法树按照组件数据渲染成结构化数据。

### 文件拆分

我们在开发组件模板时，Joker 提供标准的 HTML 标签式 加 动态指令的开发规范，这些开发态的代码不会在浏览器中直接运行，浏览器不支持 Joker 提供的开发规范，当我们在运行时，我们会借助`Joker CLI`的编译将 Joker 文件进行转译，将 SFC 文件拆分为三个可被浏览器执行的文件：

-   `*.joker?type=script` 组件类
-   `*.joker?type=template` 组件渲染模板
-   `*,joker?type=style` 组件样式

通过这三个文件来实现一个组件的运行，当然在实际的生产环境时，这三个文件会被合并压缩，只有在开发（DEV）环境时，才会出现这三种文件类型，这是因为`Joker CLI`采用的是`ES Module模块`加载机制，按需编译运行，详细内容可去 [Joker CLI](/cli) 查看。

### 渲染模板

通过了解文件拆分规则，本节主要介绍下 templte 的渲染机制。

由于浏览器不识别 Joker 的语法，我们会在编译时，通过 CLI 对`template`内容进行编译转换，将其转换为 AST[]语法树，这些语法树会在组件需要装载时，通过`Parser`解析类以及当前组件的实例编译为`VNode.Node[]`虚拟 DOM 树，当构建完整个虚拟 DOM 树后，将在通过`Render`渲染类去做实际的渲染。

![render](/base/render.png)

-   `AST.Node[]`用于将 template 转换为可被 Joker Core 识别的数据。

-   `VNode.Node[]`用于存放当前渲染输出的结构化数据。

> Joker 文件转换为 AST.Node[]的过程只会在`DEV`、`Prod`的 CLI 过程中，实际生产构建后，产出物只有 JS 和 CSS，不再有模版解析成 AST 的过程。

当`AST.Node[]`被编译为`VNode.Node[]`时，会关联当前节点和响应数据的关系，当响应式数据变更时，会通过**Parser**渲染类去更新虚拟节点，然后将虚拟节点更新到 DOM 中，由于一次变更的更新范围是固定的，所以这个过程是**即时**的，性能是最优的。

由于页面渲染是`即时`的，这也就意味着，当我们通过响应式数据去更改值时，我们可以立即获取到被更新的 DOM 节点数据。

!!!demo1!!!

:::warning
当我们在一个代码逻辑内需要频繁更改响应数据时，DOM 也会执行多次更新，会带来不必要的性能开销，这时你可以使用[组合回复](/base/combined-reply)来实现组包一次性渲染。
:::

### 跨平台/一码多端 [高阶 API]

Render 渲染类是支持插拔的，目前 Joker Core 内部默认继承了`HTML Render`实现类，可以将`VNode.Node[]`编译为`DOM Node`。

你也可以自定义 Render 来，来实现目标平台的结果输出：

```ts
import { IContainer, Render } from "@joker.front/core";

//注入你的实现类
IContainer.bind(Render.IRENDERIOCTAGID, 你的实现类);
```

你的实现类需要实现`Render.IRender`接口的所有属性。

```ts
export interface IRender {
    /**
     * 挂载
     * @param root 挂载根
     * 不限制root类型，为后面做多端兼容
     */
    mount(root: any): void;

    /**
     * 添加节点
     * @param node NodeInfo
     */
    appendNode(node: VNode.Node): void;

    /**
     * 更新节点
     * @param node NodeInfo
     * @param propertyKey 更新属性名称
     */
    updateNode(node: VNode.Node, propertyKey?: string): void;

    /**
     * 删除节点
     * @param {VNode.Node} node
     * @param {VNode.Node} parent 如果为空则带表root跟节点下集
     * @param {boolean} reserveOutPut 是否需要保留out产物
     */
    removeNode(node: VNode.Node, reserveOutPut?: boolean): void;

    /**
     * 销毁，卸载DOM并释放变量
     */
    destroy(): void;

    /**
     * element节点transition enter
     */
    elementToEnter(node: VNode.Element, name: string, type?: TransitionType, callBack?: Function): void;

    /**
     * element节点transition leave
     */
    elementToLeave(node: VNode.Element, name: string, type?: TransitionType, callBack?: Function): void;

    /**
     * 触发组件事件
     * @param node
     * @param eventName
     * @returns false 则代表停止广播
     */
    triggerEvent(node: VNode.Component, eventName: string, e: VNode.Event): void | false;
}
```

Joker 后续将不断完善主流市场平台的输出对接，包括原生客户端、小程序等。
