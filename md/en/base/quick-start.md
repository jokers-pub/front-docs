## Quick Start

This guide explains how to use the Joker CLI tool to set up your Joker development environment. It includes prerequisite conditions, installing the CLI, creating an initial workspace and a starter application, and running the application locally to verify your setup.

**We offer two development modes:**

1. Official website visual development platform ([Visual Platform](https://viscode.jokers.pub)) **Recommended**
2. Local code development

The following is the tutorial for the local development mode:

### Prerequisite Conditions

To use the Joker framework, you need to be familiar with the following technologies:

-   [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/A_re-introduction_to_JavaScript)

-   [HTML](https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML)

-   [CSS](https://developer.mozilla.org/docs/Learn/CSS/First_steps)

-   [Typescript](https://www.typescriptlang.org/)

TypeScript is a superset of JavaScript. Through type inference, type annotations can be added to enhance the static verification of code. Type definitions help clarify the interfaces between software components and understand the behavior of existing JavaScript libraries.

To install Joker on your local system, the following steps are required:

| Requirement         | Introduction                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js             | Joker requires the [Active LTS or Maintenance LTS version of Node.js](https://nodejs.org/en)                                                                                                                                                                                                                                                                                              |
| npm Package Manager | Joker, Joker CLI, and Joker applications all rely on npm packages to implement various features and functions. To download and install npm packages, you need an npm package manager. This guide uses the npm client command-line interface, which is usually installed by default along with Node.js. To check if you have installed the npm client, run `npm -v` in the terminal window |

For package management, we recommend using [pnpm](https://pnpm.js.org/) to manage the packages of the current project. The installation is very simple:

```
npm i -g pnpm
```

### Installing Joker CLI

If you are an experienced developer, the project framework must depend on at least the following two packages:

```
//CLI Scaffolding
pnpm add @joker.front/cli

//Core Kernel
pnpm add @joker.front/core
```

After installing the above two packages, the framework setup is completed.

If you are a novice, we recommend following the steps below to quickly learn how to use it:

You can use the Joker CLI to create projects, generate application and library code, and perform various continuous development tasks such as testing, packaging, and deployment.

To install the Joker CLI, open a terminal/console window and run the following command:

```
pnpm i -g @joker.front/cli
```

> On Windows client computers, the execution of PowerShell scripts is disabled by default. To allow the execution of PowerShell scripts required by npm global binaries, you must set the following [execution policy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view = powershell-7.4)

**Set-ExecutionPolicy-Scope CurrentUser-ExecutionPolicy RemoteSigned**

### Creating a Workspace and an Initial Application

You need to develop applications in the context of a Joker workspace.

To create a new workspace and an initial starter application:

1. Run the CLI command **joker create** and provide the name `my-app` as a parameter, as shown below:

```
joker create my-app
```

2. In the `my-app` working directory, install dependencies

```
cd my-app

pnpm i
```

The CLI will create a new workspace and a simple welcome application that you can run at any time.

### Running the Application

The Joker CLI includes a server command and a build command. The server command makes it easy for you to build and serve the application locally.

We provide two commands, `dev` and `build`, representing the development environment and code building respectively.

1. Navigate to the workspace folder, such as `my-app`.

```
cd my-app
```

2. Run the following command:

```
npm run dev
```

After successful execution, you will see a simple sample page.

### Installing VSCODE and Plugins

Click [here](https://code.visualstudio.com/) to download VSCODE from the official website and install it.

Search for the `Joker Front Tools` extension in the VSCODE app marketplace.

![Installing VSCODE Plugin](/base/vscode-extend-install.png)

Be sure to install the `Joker Front Tools` extension, which provides:

-   Highlighting for SFC Joker single-file components
-   Joker code formatting
-   Joker code hints
-   Joker code checking

In addition, it provides many basic development assistance capabilities, and this extension will greatly improve development efficiency.

### Next Steps

For a detailed introduction to the basic concepts and terms of the Joker single-page application architecture and design principles, refer to the basic concepts section of Joker.

Go through the development tutorial, which is a complete hands-on exercise that will teach you the process of developing applications using the Joker CLI and gradually introduce important subsystems.

To learn more about using the Joker CLI, refer to the CLI overview.
