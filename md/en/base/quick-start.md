## Quick Start Guide  

This guide explains how to set up your Joker development environment using the Joker CLI tool. It includes prerequisites, CLI installation, creating an initial workspace and starter application, and running the application locally to verify your setup.  

**We offer two development modes:**  

1. Official Visual Development Platform ([Visual Platform](https://viscode.jokers.pub)) **Recommended**  
2. Local Code Development  

Below is the tutorial for the local development mode:  

### Prerequisites  

To use the Joker framework, you should be familiar with the following technologies:  

-   [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/A_re-introduction_to_JavaScript)  
-   [HTML](https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML)  
-   [CSS](https://developer.mozilla.org/docs/Learn/CSS/First_steps)  
-   [TypeScript](https://www.typescriptlang.org/)  

TypeScript is a superset of JavaScript that enhances static validation through type inference and annotations. Type definitions help clarify interfaces between software components and improve understanding of existing JavaScript library behaviors.  

To install Joker on your local system, follow these steps:  

| Requirement    | Description                                                                                                                                                                                                                                       |  
| ---------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |  
| Node.js        | Joker requires Node.js [Active LTS or Maintenance LTS version](https://nodejs.org/en).                                                                                                                                                           |  
| npm Package Manager | Joker, Joker CLI, and Joker applications rely on npm packages for various features and functionalities. To download and install npm packages, you need an npm package manager. This guide uses the npm client CLI, which is typically installed by default with Node.js. To check if you have the npm client installed, run `npm -v` in a terminal window. |  

For package management, we recommend using [pnpm](https://pnpm.js.org/) for managing packages in the current project. Installation is simple:  

```
npm i -g pnpm
```

### Installing the Joker CLI  

If you are an experienced developer, the project framework must include at least the following two packages:  

```
// CLI Scaffolding  
pnpm add @joker.front/cli  

// Core Package  
pnpm add @joker.front/core  
```  

After installing these two packages, the framework setup is complete.  

For beginners, we recommend following the steps below to quickly learn how to use the framework:  

You can use the Joker CLI to create projects, generate application and library code, and perform various continuous development tasks such as testing, building, and deployment.  

To install the Joker CLI, open a terminal/console window and run the following command:  

```
pnpm i -g @joker.front/cli  
```  

> On Windows client machines, PowerShell script execution is disabled by default. To allow execution of PowerShell scripts required for npm global binaries, you must set the following [Execution Policy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4):  

**Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned**  

### Creating a Workspace and Initial Application  

You will develop your application within the context of a Joker workspace.  

To create a new workspace and initial starter application:  

1. Run the CLI command `joker create` and provide the name `my-app` as an argument, as shown below:  

```
joker create my-app  
```  

2. Install dependencies in the `my-app` workspace directory:  

```
cd my-app  

pnpm i  
```  

The CLI will create a new workspace and a simple welcome application that you can run at any time.  

### Running the Application  

The Joker CLI includes a server command and a build command. The server command facilitates local building and serving of the application.  

By default, we provide two commands: `dev` (development environment) and `build` (code compilation).  

1. Navigate to the workspace folder (e.g., `my-app`).  

```
cd my-app  
```  

2. Run the following command:  

```
npm run dev  
```  

After successful execution, you will see a simple example page.  

### Installing VSCODE and Extensions  

Click [here](https://code.visualstudio.com/) to download and install VSCODE from the official website.  

Search for the `Joker Front Tools` extension in the VSCODE Marketplace.  

![Install VSCODE Extension](/base/vscode-extend-install.png)  

Be sure to install the `Joker Front Tools` extension, which provides the following features:  
- Syntax highlighting for Joker SFC (Single File Components)  
- Joker code formatting  
- Joker code hints  
- Joker code linting  

Additionally, it offers many foundational development aids, significantly improving development efficiency.  

### Next Steps  

For a comprehensive introduction to the basic concepts and design principles of Joker's single-page application architecture, refer to the Joker Fundamentals section.  

Go through the development tutorial—a hands-on exercise that will guide you through the process of application development using the Joker CLI, introducing key subsystems step by step.  

For more information about using the Joker CLI, see the CLI Overview.