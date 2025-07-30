## 事件注册

该章节主要介绍下，如何在 template 模板中为标签/组件注册交互事件。

### 监听事件

我们可以使用`@('@事件名称')`指令来监听 DOM/组件 事件，并在事件触发时执行对应的 JavaScript。

```html
<button @click="handleClick">按钮</button>
```

上面的代码示例表示我们为 button 按钮注册一个`click`事件，事件的处理函数为 **handleClick**

!!!demo1!!!

### 执行事件传参

事件参数分为两种：

-   一种为事件对象参数，该参数是由[$trigger](/base/component-api)进行传递，该参数会随着事件传递在组件内流转。
-   一种是执行事件方法参数，该参数作为本次事件的参数，只会在当前组件、本次事件中生效。

我们来看一下，如何进行执行事件传参：

```html
<template>
    <button @click="handleClick('参数')">按钮</button>
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

### VNode.Event 介绍

VNode.Event 作为 Joker 前端中事件处理对象，无论是通过 JS 主动响应的事件还是原生事件触发，都会将该类型作为第一个参数传递到事件处理函数中。

其中该对象中具有一个`data`属性，代表事件传递的参数，可通过泛型来指定值类型，方便后续操作，默认为 undefined。

| 属性名称        | 说明                         | 类型                 |
| --------------- | ---------------------------- | -------------------- |
| eventName       | 事件名称                     | string               |
| event           | 原生事件对象，取决于运行平台 | any                  |
| target          | 响应该事件的虚拟节点         | VNode.Node/undefined |
| data            | 事件参数                     | <T>:any              |
| preventDefault  | 阻止默认事件                 | function             |
| stopPropagation | 阻止事件传播                 | function             |

### 事件修饰符

我们提供了丰富的事件修饰符，旨在帮助开发人员更高效地处理逻辑，无需深入涉及 DOM 事件的复杂细节。

结合 Joker 的 VSCODE 工具，可以在事件后自动提示可选的修饰符，目前提供的修饰符有：

| 修饰符  | 说明                                                                                                                                                            |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stop    | 防止事件冒泡，等同于 JavaScript 中的 event.stopPropagation()                                                                                                    |
| prevent | 防止执行预设的行为（如果事件可取消，则取消该事件，而不停止事件的进一步传播），等同于 JavaScript 中的 event.preventDefault()                                     |
| self    | 只会触发自己范围内的事件，不包含子元素，只当在 event.target 是当前元素自身时触发处理函数，即事件不是从内部元素触发的                                            |
| once    | 只会触发一次，执行完后立即移除事件                                                                                                                              |
| passive | 是一个用于标记事件处理程序的参数，用于告诉浏览器该事件处理程序不会调用                                                                                          |
| outside | 当点击自身以外的区块时，才会触发该事件，该事件是通过全局事件监听实现，建议使用 outside 时，配合 if 进行使用，保证元素会即时销毁，元素销毁时会解除全局事件监听。 |

> 关于 outside 修饰符，outside 的监测逻辑是 输出的实际 DOM 中事件触发对象不在该节点内部（含包含） `并且` **VNode.Node**结构中也不是包含关系，详细场景可参考[组件内置属性](/base/template-property)中的**append-to**属性。

当事件类型为键盘事件时，会提供以下修饰符：

| 修饰符 | 说明                      |
| ------ | ------------------------- |
| enter  | 回车键                    |
| tab    | 制表键                    |
| delete | 含 delete 和 backspace 键 |
| esc    | 返回键                    |
| space  | 空格键                    |
| up     | 向上键                    |
| down   | 向下键                    |
| left   | 向左键                    |
| right  | 向右键                    |

当事件类型为鼠标事件时，我们提供以下修饰符：

| 修饰符 | 说明         |
| ------ | ------------ |
| left   | 鼠标左键     |
| right  | 鼠标右键     |
| middle | 鼠标中间滚轮 |

以下是系统修饰符，当键盘/鼠标类型事件时提供：

| 修饰符 | 说明     |
| ------ | -------- |
| ctrl   | ctrl 键  |
| alt    | alt 键   |
| shift  | shift 键 |

值得注意的是，这些修饰符是可以被组合使用的，我们为一个事件添加多个修饰符，以满足不同的场景需要，例如：

```html
<button @click.ctrl.prevent.stop="handleClick">按钮</button>
```
