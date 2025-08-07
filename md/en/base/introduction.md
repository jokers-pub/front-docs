## Introduction

### What is Joker?

Joker is a framework platform designed to support all development scenarios. Among them, **Joker.front** is the front-end development framework under the Joker platform. It provides standardized front-end development specifications and employs an object-oriented, component-based programming model to help you efficiently develop user interfaces. Whether for simple or complex interfaces, Joker.front can handle them with ease.

Joker is an all-in-one development platform built on TypeScript. It excels in both performance and stability, whether meeting the needs of simple interface development or handling complex user interfaces. It encompasses the following key features:

- **Powerful Extensibility**: Joker offers a component-based framework designed with scalability in mind from the outset. It can be seamlessly integrated into existing projects or systems and supports scalable web application development with customizable solutions tailored to project requirements.
- **Rich Component Library**: Joker.front provides a comprehensive set of front-end components, including routing, scaffolding, and meticulously designed and optimized UI components, enabling developers to quickly build visually appealing and high-performance user interfaces.
- **Complete Development Tooling**: To further boost development efficiency, Joker includes a suite of supporting tools such as debugging and build tools. These thoughtfully designed utilities streamline the development process, helping developers efficiently code, build, test, and update with precision.

Below is a basic example:

!!!demo1!!!

The example above showcases two core features of Joker:

- **Class API**: Joker adopts TypeScript as the scripting standard and employs the Class API as the development specification, making it better aligned with object-oriented programming principles.
- **Reactivity**: Joker automatically tracks JavaScript state and reactively updates the DOM when changes occur. These updates are immediate, eliminating virtual DOM diff comparisons.

You might have some questions—don’t worry. We’ll cover each detail in subsequent documentation. For now, read on to gain a comprehensive understanding of Joker's capabilities as a framework.

:::tip Prerequisites  
The following documentation assumes you have a basic understanding of **HTML**, **CSS**, **JavaScript**, and **TypeScript**. If you’re new to front-end development, we recommend starting with foundational knowledge before delving deeper into Joker. You can assess your JavaScript proficiency with this [JavaScript Guide](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Prior experience with other frameworks can be helpful but isn’t required.

To better understand and use Joker, familiarity with **TypeScript** is also recommended. You can learn it via the [TypeScript Official Website](https://www.typescriptlang.org/).  
:::

## Extreme Performance

Joker leverages advanced rendering logic to enable precise point-to-point updates between reactive data and DOM nodes. The platform incorporates intelligent dependency tracking, allowing it to quickly locate corresponding DOM nodes when reactive data changes. This approach eliminates the need for virtual DOM repainting and complex tree-diffing operations, significantly improving real-time rendering performance.

![VNode](/base/render.png)

![AST-Element](/base/ast-element.png)

## Joker Applications: Key Concepts

### Single-File Components

In most Joker projects that use build tools, components are authored in a file format resembling HTML, known as **Single-File Components (SFCs)** (with the extension `*.joker`). As the name suggests, Joker’s SFCs encapsulate a component’s logic (JavaScript), template (HTML), and styles (CSS) within a single file, enhancing development efficiency and focus.

> To work effectively with `.joker` SFCs, it’s recommended to use an **IDE plugin**. Currently, we support **VS Code**, the most popular development tool. You can install the **Joker Front Tools** extension from the VS Code marketplace or download it locally from [here](https://marketplace.visualstudio.com/items?itemName=JokerZohar.joker-front-tools).

With SFCs, developers can work efficiently on a page or component without switching between different files:

!!!demo2!!!

In the Joker ecosystem, **everything is a component**—whether it’s a functional component or an entire page.

### Templates

Every Joker component has an HTML template that defines how the component should render. You can choose to inline the template within the `.joker` file or reference an external template via a file path.

To extend HTML’s capabilities, Joker introduces special syntax elements. The dynamic directive `@` allows inserting dynamic values into the component. When the component’s state changes, Joker automatically updates the rendered DOM. One application of this feature is inserting dynamic text, ensuring the UI stays synchronized with the component’s state, as shown below:

!!!demo3!!!

Beyond dynamic directives, Joker provides numerous built-in directives to help developers quickly construct dynamic templates. Here’s a simple example:

!!!demo4!!!

If you’re unfamiliar with the syntax, don’t worry—we’ll dive deeper into Joker’s syntax in later sections.

## Built-in Libraries

In the "Key Concepts" section, we briefly introduced the architectural elements needed to build a Joker application. However, Joker’s true strength emerges as your application scales and requires additional features like site navigation or user input. Leveraging Joker’s powerful ecosystem, you can easily integrate one of its **built-in libraries** to add the functionality you need, simplifying development and enriching your application.

Here are some libraries available for use:

| Library                                          | Description                                                                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| [@('@joker.front/cli')](/cli/introduction)       | Joker’s scaffolding tool for running and building projects, utilizing **esbuild** with dynamic compilation for exceptional performance. |
| [@('@joker.front/router')](/router/introduction) | Joker’s routing library for managing page navigation, supporting features like page jumps, state passing, and keepalive.                |
| [@('@joker.front/ui')](http://ui.jokers.pub)     | Joker’s official PC-side component library, offering a complete set of interactive components for various business scenarios.           |

These libraries expand your application’s capabilities while allowing you to focus on developing unique features that make your app stand out. They integrate seamlessly with the Joker framework, ensuring updates remain in sync.

**Only introduce these libraries when you need them to enhance functionality or solve specific problems.**
