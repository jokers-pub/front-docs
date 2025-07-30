## Introduction

### What is Joker?

Joker is a framework platform designed to support all development scenarios. Among them, Joker.front is the front-end development framework under the Joker platform. It provides standardized front-end development standards and uses an object-oriented, component-based programming model to help you develop user interfaces efficiently. Whether it is a simple or complex interface, Joker.front can handle it with ease.

Joker is an all-around development platform built on TypeScript. It can demonstrate excellent performance and stability whether dealing with simple interface development requirements or complex user interfaces. It encompasses the following important features:

-   **Powerful Scalability**: Joker provides a component-based framework. Scalability was considered from the beginning of the platform design. Therefore, it can be easily integrated into existing projects or systems, supports the construction of scalable web applications, and can be customized according to project requirements.
-   **Rich Component Library**: Joker.front provides a rich front-end component library, including well-designed and optimized functional and UI components such as routers and scaffolding, which can help developers quickly build beautiful and high-performance user interfaces.
-   **Complete Development Tools**: To further improve development efficiency, Joker also provides a series of supporting development tools, including debugging tools and building tools. These carefully designed tools aim to make the development process smoother, enabling developers to develop, build, test, and update code accurately and quickly.

Here is a basic example:

!!!demo1!!!

The above example demonstrates two core functions of Joker:

-   **Class API**: Joker uses Typescript as the scripting development standard and adopts the standard Class API as the development specification, which is more in line with the requirements of object-oriented development.
-   **Responsiveness**: Joker automatically tracks JavaScript state and updates the DOM reactively when it changes. The reactive update is immediate, and there is no virtual DOM difference comparison.

You may already have some questions-don't worry. We will introduce every detail in the subsequent documents. Now, please continue reading to ensure that you have a comprehensive understanding of the functions provided by Joker as a framework.

:::tip Prerequisite Knowledge
The subsequent content of the document will assume that you have a basic understanding of HTML, CSS, JavaScript, and Typescript. If you are not familiar with front-end development, it is recommended that you start learning from the basic knowledge and then come back here to understand Joker in depth. You can test your JavaScript knowledge level through this [JavaScript Overview](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript). If you have experience with other frameworks before, it will be more helpful, but it is not necessary.

To better understand and use Joker, you also need to be familiar with Typescript. You can learn it through the [Typescript official website](https://www.typescriptlang.org/).
:::

## Extreme Performance

Joker employs advanced rendering logic, enabling precise point-to-point updates between reactive data and DOM nodes. The platform is equipped with an intelligent relationship collection mechanism. When the reactive data changes, it can quickly locate the corresponding DOM nodes, thus avoiding complex operations such as the redrawing of virtual nodes and the comparison of binary trees. This significantly enhances the performance of real-time rendering.

![VNode](/base/render.png)

![AST-Element](/base/ast-element.png)

## Joker Applications: Key Points

### Single-File Components

In most Joker projects with build tools enabled, we can write Joker components in a file similar to the HTML format. This kind of file is called a **Single-File Component** (or simply `*.joker` file, English Single-File Components, abbreviated as **SFC**). As the name implies, Joker's single-file components encapsulate the logic (JavaScript), template (HTML), and style (CSS) of a component in the same file, making the development process more efficient and focused.

> To better use the `.joker` single-file components, we need to operate with the help of IDE plugins. Currently, we already support the most popular development tool in the market-VSCODE. You can install it by searching for **Joker Front Tools** in the VSCODE extension store, or download it locally for installation through [Download](https://marketplace.visualstudio.com/items?itemName=JokerZohar.joker-front-tools).

Using single-file components, we can quickly develop and focus on a page or component without having to switch between different files, thus improving development efficiency:

!!!demo2!!!

In the Joker system, everything is a component, whether it is a functional component or a page, and they are all used in the form of components.

### Templates

Each Joker component has an HTML template that defines how the component is rendered. You can choose to inline the template in the `.joker` file or reference an external template through a file path.

To extend the functionality of HTML, Joker has introduced some special syntax elements. Among them, the `@` dynamic directive allows you to insert dynamic values into the component. When the state of the component changes, Joker automatically updates the rendered DOM. One application of this function is to insert dynamic text to ensure that the interface is synchronized with the component state. The following example shows this.

!!!demo3!!!

In addition to the above dynamic directive, Joker also provides many commands to help developers quickly build dynamic templates. The following is a simple example:

!!!demo4!!!

If you don't understand the above syntax, don't worry. We will study Joker's syntax in more depth later.

## Built-in Libraries

In the "Joker Applications: Key Points" section, we briefly introduced the key architectural elements required when building a Joker application. However, the real advantages of Joker become apparent when your application continues to expand and you want to add more functions (such as site navigation or user input). At that time, you can take advantage of the powerful functions of the Joker platform and easily introduce one of the many built-in libraries provided by Joker, thereby adding the required functions to your application. This will greatly simplify the development process, improve development efficiency, and enrich your application.

Some of the libraries you can use include:

| Library                                          | Introduction                                                                                                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@('@joker.front/cli')](/cli/introduction)       | Joker scaffolding, used to run and build projects, adopting the esbuild and dynamic compilation mechanism, with excellent performance                       |
| [@('@joker.front/router')](/router/introduction) | Joker routing library, used to manage page routes, and provides functions such as page navigation, value passing, and keepalive                             |
| [@('@joker.front/ui')](http://ui.jokers.pub)     | The PC-end component library officially provided by Joker, with complete interactive components that can meet the business development of various scenarios |

These libraries not only expand the capabilities of the application but also allow you to focus more on developing unique features to make your application stand out. When you need to add new features to the application or solve specific problems, you can flexibly introduce these libraries. These libraries are seamlessly integrated with the Joker framework to ensure synchronous updates with the application.

Only introduce these libraries when you actually need them to enrich the application functions or solve specific problems.
