## 快速上手

本指南讲解了如何使用 Joker CLI 工具搭建你的 Joker 开发环境。包括：前提条件、安装 CLI、创建初始工作区和入门应用，以及在本地运行这个应用来验证你的搭建成果。

**我们提供了两种开发模式：**

1. 官网可视化开发平台 ([可视化平台](https://viscode.jokers.pub)) **推荐**
2. 本地代码开发

下面是本地开发模式的指导教程：

### 前提条件

要想使用 Joker 框架，你需要熟悉以下技术：

-   [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/A_re-introduction_to_JavaScript)

-   [HTML](https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML)

-   [CSS](https://developer.mozilla.org/docs/Learn/CSS/First_steps)

-   [Typescript](https://www.typescriptlang.org/)

TypeScript 是 JavaScript 的超集，通过类型推断功能，可以添加类型注释来增强代码的静态验证。类型定义有助于明确软件组件之间的接口，并帮助理解现有 JavaScript 库的行为。

要想在你的本地系统中安装 Joker，需要如下步骤：

| 需求         | 介绍                                                                                                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js      | Joker 需要 Node.js 的[活跃 LTS 版或维护期 LTS 版](https://nodejs.org/en)                                                                                                                                                                    |
| npm 包管理器 | Joker、Joker CLI 以及 Joker 应用都依赖于 npm 包来实现各种特性和功能。要下载并安装 npm 包，你需要一个 npm 包管理器。本指南使用 npm 客户端命令行界面，它通常与 Node.js 一起默认安装。要检查你是否安装了 npm 客户端，请在终端窗口中运行 npm -v |

对于包管理，我们建议使用[pnpm](https://pnpm.js.org/)，来进行当前项目的包管理，安装也非常简单：

```
npm i -g pnpm
```

### 安装 Joker CLI

如果你是一个经验丰富的开发人员，项目框架必须至少依赖以下两个包：

```
//CLI 脚手架
pnpm add @joker.front/cli

//Core 核心
pnpm add @joker.front/core
```

安装以上两个包后即完成了框架的搭建工作。

如果你是新手，我们建议按照以下流程操作，以便快速去学习如何使用：

你可以使用 Joker CLI 来创建项目，生成应用和库代码，以及执行各种持续开发任务，比如测试、打包和部署。

要安装 Joker CLI，请打开终端/控制台窗口，并运行如下命令：

```
pnpm i -g @joker.front/cli
```

> 在 Windows 客户端计算机上，默认禁用 PowerShell 脚本的执行。要允许执行 npm 全局二进制文件所需的 PowerShell 脚本，你必须设置以下内容[执行策略](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4)

**Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned**

### 创建工作区和初始应用

你要在 Joker 工作区的上下文中开发应用。

要创建一个新的工作区和初始入门应用：

1. 运行 CLI 命令 **joker create** 并提供 my-app 名称作为参数，如下所示：

```
joker create my-app
```

2. 在 my-app 工作目录下，安装依赖

```
cd my-app

pnpm i
```

CLI 会创建一个新的工作区和一个简单的欢迎应用，你可以随时运行它。

### 运行应用

Joker CLI 中包含一个服务器命令 以及 构建命令，服务器命令可以方便你在本地构建和提供应用。

我们默认提供了`dev`和`build`两个命令，分别代表开发环境和代码构建。

1. 导航到 workspace 文件夹，比如 my-app。

```
cd my-app
```

2. 运行下列命令：

```
npm run dev
```

成功运行后，会开到一个简单的示例页面。

### 安装 VSCODE 及插件

点击[这里](https://code.visualstudio.com/)去官网下载 VSCODE，并进行安装。

在 VSCODE 应用市场内查找`Joker Front Tools`扩展。

![安装VSCODE插件](/base/vscode-extend-install.png)

请务必安装`Joker Front Tools`扩展，该扩展可以提供：

-   SFC Joker 单文件组件的高亮
-   Joker 代码格式化
-   Joker 代码提示
-   Joker 代码检查

除此之外，还提供很多基础的开发辅助能力，该扩展会大大提高开发效率。

### 下一步

关于 Joker 单页应用程序架构和设计原理的基本概念和术语的详尽介绍，参阅 Joker 的基本概念部分。

过一遍开发教程，这是一个完整的动手练习题，它将教你使用 Joker CLI 进行应用开发的过程，并逐步介绍重要的子系统。

要了解关于使用 Joker CLI 的更多信息，请参阅 CLI 概述。
