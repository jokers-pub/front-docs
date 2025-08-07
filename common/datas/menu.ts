export namespace MenuZhCN {
    export const BASE_MENUS = [
        {
            objectID: "1-1",
            title: "开始",
            description: "框架帮助文档，涵盖基础信息与快速入门引导",
            children: [
                {
                    objectID: "1-1-1",
                    title: "简介",
                    path: "/cn/base/introduction",
                    description:
                        "提供关于本框架的基本信息介绍，包括其设计目标、核心特性以及适用场景等内容，帮助用户初步了解框架的整体概况。"
                },
                {
                    objectID: "1-1-2",
                    title: "快速上手",
                    path: "/cn/base/quick-start",
                    description:
                        "详细的步骤指导，从框架的安装、环境配置到创建第一个示例项目，使新手用户能够快速搭建起基础的框架运行环境并开始进行简单的开发实践。"
                }
            ]
        },
        {
            objectID: "1-2",
            title: "组件",
            description: "框架组件相关知识与使用说明，包含组件多方面特性与应用细节",
            children: [
                {
                    objectID: "1-2-1",
                    title: "概述",
                    path: "/cn/base/component",
                    description:
                        "对框架组件的概念、功能范围以及在整个框架体系中的角色进行宏观阐述，包括组件的分类方式和基本组成结构等信息。"
                },
                {
                    objectID: "1-2-2",
                    title: "组件生命周期",
                    path: "/cn/base/component-lifecycle",
                    description:
                        "深入讲解组件从创建到销毁过程中所经历的各个阶段，如初始化阶段、挂载阶段和卸载阶段，以及在每个阶段可执行的操作和对应的钩子函数。"
                },
                {
                    objectID: "1-2-3",
                    title: "组件的内置方法",
                    path: "/cn/base/component-api",
                    description:
                        "列举组件自带的各种内置方法，说明其功能、参数要求以及返回值类型，同时提供使用示例，展示如何在实际开发中调用这些方法来实现特定的组件功能。"
                },
                {
                    objectID: "1-2-4",
                    title: "组件的内置属性",
                    path: "/cn/base/component-property",
                    description:
                        "介绍组件预先定义的内置属性，包括属性的用途、数据类型以及默认值，讲解如何通过设置这些属性来定制组件的外观和行为。"
                },
                {
                    objectID: "1-2-5",
                    title: "组件的注册",
                    path: "/cn/base/component-register",
                    description:
                        "阐述组件在框架中的注册流程，包括全局注册和局部注册的方式、区别以及适用场景，提供代码示例演示如何正确地将组件注册到框架中以便在项目中使用。"
                },
                {
                    objectID: "1-2-6",
                    title: "全局事件总线",
                    path: "/cn/base/event-bus",
                    description:
                        "讲解全局事件总线的概念和工作原理，说明如何利用它实现组件之间的非父子关系通信，通过实例展示如何在不同组件中订阅和发布事件来传递数据和触发操作。"
                }
            ]
        },
        {
            objectID: "1-3",
            title: "模板",
            description: "框架模板相关知识与使用细节，涉及模板全方位的操作与应用",
            children: [
                {
                    objectID: "1-3-1",
                    title: "概述",
                    path: "/cn/base/template",
                    description:
                        "对框架模板系统进行总体介绍，包括模板的作用、基本语法规则以及与其他部分的交互方式，使读者对模板有一个整体的认识。"
                },
                {
                    objectID: "1-3-2",
                    title: "条件渲染",
                    path: "/cn/base/template-if",
                    description:
                        "详细说明模板中的条件渲染语法，如何根据不同的条件表达式来决定模板片段是否显示，提供多种条件判断的示例以及在实际应用中的注意事项。"
                },
                {
                    objectID: "1-3-3",
                    title: "列表渲染",
                    path: "/cn/base/template-for",
                    description:
                        "讲解模板用于列表渲染的语法和用法，包括如何遍历数组、对象等数据结构来生成动态的列表元素，以及在列表渲染过程中对索引、键值等的处理方式。"
                },
                {
                    objectID: "1-3-4",
                    title: "区块渲染",
                    path: "/cn/base/template-section",
                    description:
                        "介绍模板中区块渲染的概念和实现方式，例如如何划分不同的模板区块并进行有针对性的渲染操作，以及区块渲染在优化模板结构和提高渲染效率方面的应用。"
                },
                {
                    objectID: "1-3-5",
                    title: "事件注册",
                    path: "/cn/base/template-event",
                    description:
                        "阐述在模板中注册事件的方法，包括各种事件类型（如点击事件、输入事件等）的注册语法，以及事件处理函数的定义和传递参数的方式，通过实例展示事件在模板中的响应机制。"
                },
                {
                    objectID: "1-3-6",
                    title: "内置属性",
                    path: "/cn/base/template-property",
                    description:
                        "介绍模板自身的内置属性，这些属性可用于控制模板的渲染行为、获取模板相关的信息等，说明如何在模板中使用这些属性来实现特定的功能需求。"
                },
                {
                    objectID: "1-3-7",
                    title: "组件样式",
                    path: "/cn/base/style",
                    description:
                        "讲解在框架模板中应用组件样式的方式，包括内联样式、外部样式表的引入以及样式作用域的控制，提供样式命名规范和样式优先级处理的相关知识。"
                }
            ]
        },
        {
            objectID: "1-4",
            title: "渲染",
            description: "框架渲染机制解析，深入探究渲染原理与关键环节",
            children: [
                {
                    objectID: "1-4-1",
                    title: "概述",
                    path: "/cn/base/render",
                    description:
                        "对框架的渲染原理进行总体概述，包括从数据变化到页面更新的整个流程，介绍涉及的主要模块和关键技术点，使读者对渲染机制有一个宏观的理解。"
                },
                {
                    objectID: "1-4-2",
                    title: "AST",
                    path: "/cn/base/ast",
                    description:
                        "深入讲解抽象语法树（AST）在框架渲染中的作用，包括如何将模板代码转换为 AST，AST 的结构和节点类型，以及如何基于 AST 进行优化和生成最终的渲染代码。"
                },
                {
                    objectID: "1-4-3",
                    title: "VNode",
                    path: "/cn/base/vnode",
                    description:
                        "阐述虚拟节点（VNode）的概念、创建过程以及在渲染过程中的作用，说明 VNode 如何与真实 DOM 进行交互和更新，以及 VNode 的缓存和复用机制在提高渲染性能方面的应用。"
                }
            ]
        },
        {
            objectID: "1-5",
            title: "数据响应",
            description: "框架数据响应原理与应用，解读数据响应核心要点",
            children: [
                {
                    objectID: "1-5-1",
                    title: "数据代理",
                    path: "/cn/base/observer",
                    description:
                        "详细解释数据代理机制，即如何通过代理对象来访问和修改原始数据，包括代理对象的创建过程、访问拦截和修改拦截的实现方式，以及数据代理在数据响应系统中的作用。"
                },
                {
                    objectID: "1-5-2",
                    title: "订阅",
                    path: "/cn/base/watcher",
                    description:
                        "讲解数据订阅的概念和实现方式，包括如何创建订阅者对象，如何监听数据变化并触发相应的回调函数，以及数据订阅在实现数据驱动视图更新方面的重要性。"
                },
                {
                    objectID: "1-5-3",
                    title: "组合回复",
                    path: "/cn/base/combined-reply",
                    description:
                        "关于数据响应中组合相关操作的说明，可能涉及多种数据响应方式的协同运作，以及在复杂数据场景下如何利用组合机制实现高效的数据处理与视图更新。"
                }
            ]
        }
    ];

    export const ROUTER_MENUS = [
        {
            objectID: "2-1",
            title: "开始",
            description: "路由帮助文档 Router",
            children: [
                {
                    objectID: "2-1-1",
                    title: "介绍",
                    path: "/cn/router/introduction",
                    description: "对路由系统的基本概念和用途进行总体阐述，帮助用户建立初步认知。"
                },
                {
                    objectID: "2-1-2",
                    title: "入门",
                    path: "/cn/router/guide",
                    description: "提供路由使用的入门步骤和示例，引导新手快速上手。"
                }
            ]
        },
        {
            objectID: "2-2",
            title: "基础",
            description: "路由基础文档 Router",
            children: [
                {
                    objectID: "2-2-1",
                    title: "初始化路由",
                    path: "/cn/router/init",
                    description: "讲解如何在项目中初始化路由配置，包括相关参数和设置方法。"
                },
                {
                    objectID: "2-2-2",
                    title: "注册路由",
                    path: "/cn/router/registry",
                    description: "说明将路由信息注册到系统中的方式和要点。"
                },
                {
                    objectID: "2-2-3",
                    title: "视图容器",
                    path: "/cn/router/router-view",
                    description: "介绍用于展示路由对应视图的容器组件及其使用方式。"
                },
                {
                    objectID: "2-2-4",
                    title: "路由跳转",
                    path: "/cn/router/change",
                    description: "阐述在应用中实现路由跳转的不同方法和场景。"
                }
            ]
        },
        {
            objectID: "2-3",
            title: "深入了解",
            description: "深入了解Joker Router",
            children: [
                {
                    objectID: "2-3-1",
                    title: "参数传递",
                    path: "/cn/router/params",
                    description: "解释路由间参数传递的机制和多种实现方式。"
                },
                {
                    objectID: "2-3-2",
                    title: "嵌套路由",
                    path: "/cn/router/nested-routes",
                    description: "讲述如何创建和使用嵌套结构的路由，以构建复杂的页面布局。"
                },
                {
                    objectID: "2-3-3",
                    title: "路由事件/状态",
                    path: "/cn/router/event",
                    description: "介绍路由相关的事件触发机制以及状态管理方法。"
                },
                {
                    objectID: "2-3-4",
                    title: "路由信息",
                    path: "/cn/router/route",
                    description: "说明如何获取和利用路由过程中的各种信息。"
                },
                {
                    objectID: "2-3-5",
                    title: "状态保持",
                    path: "/cn/router/keepalive",
                    description: "讲解在路由切换时保持页面状态的策略和实现手段。"
                },
                {
                    objectID: "2-3-6",
                    title: "滚动行为",
                    path: "/cn/router/scroll",
                    description: "描述路由切换时页面滚动位置的控制方式。"
                },
                {
                    objectID: "2-3-7",
                    title: "历史记录模式",
                    path: "/cn/router/history",
                    description: "介绍路由的历史记录模式及其特点和应用场景。"
                }
            ]
        }
    ];

    export const CLI_MENUS = [
        {
            objectID: "3-1",
            title: "开始",
            description: "Joker CLI 帮助文档",
            children: [
                {
                    objectID: "3-1-1",
                    title: "介绍",
                    path: "/cn/cli/introduction",
                    description: "对 CLI 脚手架的基本情况、功能范围以及应用场景进行初步说明，让用户对其有整体概念。"
                },
                {
                    objectID: "3-1-2",
                    title: "入门",
                    path: "/cn/cli/guide",
                    description: "提供使用 CLI 脚手架的入门步骤，包括如何安装、初始化项目等基础操作，帮助新手快速上手。"
                }
            ]
        },
        {
            objectID: "3-2",
            title: "深入理解",
            description: "Joker CLI 深入理解",
            children: [
                {
                    objectID: "3-2-1",
                    title: "变量与模式",
                    path: "/cn/cli/define",
                    description: "详细讲解 CLI 脚手架中所涉及的变量定义与使用模式，以及如何通过这些变量来灵活配置项目。"
                },
                {
                    objectID: "3-2-2",
                    title: "依赖预构建",
                    path: "/cn/cli/dep",
                    description:
                        "阐述依赖预构建的原理、过程以及在 CLI 脚手架项目中的重要性，包括如何优化依赖处理以提高项目构建速度。"
                },
                {
                    objectID: "3-2-3",
                    title: "构建生产版本",
                    path: "/cn/cli/prod",
                    description:
                        "说明如何使用 CLI 脚手架构建生产版本的项目，涵盖相关的配置选项、优化策略以及生成文件的结构与特点。"
                }
            ]
        },
        {
            objectID: "3-3",
            title: "配置",
            description: "Joker CLI 配置说明",
            children: [
                {
                    objectID: "3-3-1",
                    title: "公共配置",
                    path: "/cn/cli/setting-public",
                    description:
                        "介绍 CLI 脚手架中适用于多种场景的公共配置项，包括这些配置项的含义、默认值以及如何根据项目需求进行调整。"
                },
                {
                    objectID: "3-3-2",
                    title: "开发服务",
                    path: "/cn/cli/setting-server",
                    description:
                        "讲解为开发过程提供服务的相关配置，如启动本地开发服务器的参数设置、热更新功能的配置以及与开发工具的集成等。"
                },
                {
                    objectID: "3-3-3",
                    title: "生产构建",
                    path: "/cn/cli/setting-build",
                    description:
                        "描述用于生产构建的特定配置，包括代码压缩、资源优化、打包策略等方面的设置，以确保生产版本的性能和稳定性。"
                }
            ]
        },
        {
            objectID: "3-4",
            title: "插件",
            description: "Joker CLI 插件",
            children: [
                {
                    objectID: "3-4-1",
                    title: "使用插件",
                    path: "/cn/cli/plugin-use",
                    description:
                        "提供使用现有插件的方法与步骤，包括如何在 CLI 脚手架项目中安装、配置和启用插件，以及如何利用插件扩展项目功能。"
                },
                {
                    objectID: "3-4-2",
                    title: "创建插件",
                    path: "/cn/cli/plugin-create",
                    description:
                        "讲述如何开发自定义插件，涵盖插件的基本结构、开发规范、接口定义以及如何将其集成到 CLI 脚手架生态系统中。"
                },
                {
                    objectID: "3-4-3",
                    title: "可选插件",
                    path: "/cn/cli/plugins",
                    description:
                        "列举一些常用的可选插件，并对其功能、特点以及适用场景进行简要介绍，帮助用户根据项目需求选择合适的插件。"
                }
            ]
        }
    ];

    export const REQUESTER_MENUS = [
        {
            title: "插件",
            objectID: "4-1",
            description: "",
            children: [
                {
                    objectID: "4-1-1",
                    title: "请求",
                    path: "/cn/requester",
                    description:
                        "Requester 是一个用于处理 HTTP 请求的类，提供了请求前置、后置和错误处理回调，支持请求缓存、超时处理、Mock 数据等功能，同时可自定义请求和响应数据的转换以及错误处理逻辑。"
                }
            ]
        }
    ];

    export let allMenus = [...BASE_MENUS, ...ROUTER_MENUS, ...CLI_MENUS, ...REQUESTER_MENUS];
}

export namespace MenuEn {
    export const BASE_MENUS = [
        {
            objectID: "1-1",
            title: "Start",
            description: "Framework help documentation, covering basic information and quick-start guides.",
            children: [
                {
                    objectID: "1-1-1",
                    title: "Introduction",
                    path: "/base/introduction",
                    description:
                        "Provides basic information about this framework, including its design goals, core features, and applicable scenarios, to help users initially understand the overall overview of the framework."
                },
                {
                    objectID: "1-1-2",
                    title: "Quick Start",
                    path: "/base/quick-start",
                    description:
                        "Detailed step-by-step guidance, from framework installation, environment configuration to creating the first sample project, enabling novice users to quickly set up a basic framework running environment and start simple development practices."
                }
            ]
        },
        {
            objectID: "1-2",
            title: "Components",
            description:
                "Knowledge and usage instructions related to framework components, including various characteristics and application details of components.",
            children: [
                {
                    objectID: "1-2-1",
                    title: "Overview",
                    path: "/base/component",
                    description:
                        "Conducts a macro-level elaboration on the concept, functional scope, and role of framework components in the entire framework system, including the classification methods and basic composition structure of components."
                },
                {
                    objectID: "1-2-2",
                    title: "Component Lifecycle",
                    path: "/base/component-lifecycle",
                    description:
                        "Deeply explains the various stages a component goes through from creation to destruction, such as the initialization stage, mounting stage, and unmounting stage, as well as the operations that can be performed at each stage and the corresponding hook functions."
                },
                {
                    objectID: "1-2-3",
                    title: "Built-in Methods of Components",
                    path: "/base/component-api",
                    description:
                        "Lists various built-in methods of components, explains their functions, parameter requirements, and return value types, and provides usage examples to show how to call these methods in actual development to achieve specific component functions."
                },
                {
                    objectID: "1-2-4",
                    title: "Built-in Properties of Components",
                    path: "/base/component-property",
                    description:
                        "Introduces the predefined built-in properties of components, including the purpose, data type, and default value of the properties, and explains how to customize the appearance and behavior of components by setting these properties."
                },
                {
                    objectID: "1-2-5",
                    title: "Component Registration",
                    path: "/base/component-register",
                    description:
                        "Explains the registration process of components in the framework, including the methods, differences, and applicable scenarios of global registration and local registration, and provides code examples to demonstrate how to correctly register components in the framework for use in projects."
                },
                {
                    objectID: "1-2-6",
                    title: "Global Event Bus",
                    path: "/base/event-bus",
                    description:
                        "Explains the concept and working principle of the global event bus, shows how to use it to achieve non-parent-child relationship communication between components, and demonstrates how to subscribe to and publish events in different components to transfer data and trigger operations through examples."
                }
            ]
        },
        {
            objectID: "1-3",
            title: "Templates",
            description:
                "Knowledge and usage details related to framework templates, involving all-round operations and applications of templates.",
            children: [
                {
                    objectID: "1-3-1",
                    title: "Overview",
                    path: "/base/template",
                    description:
                        "Provides an overall introduction to the framework template system, including the role, basic syntax rules, and interaction methods with other parts of the template, enabling readers to have an overall understanding of the template."
                },
                {
                    objectID: "1-3-2",
                    title: "Conditional Rendering",
                    path: "/base/template-if",
                    description:
                        "Details the conditional rendering syntax in templates, how to decide whether to display template fragments based on different conditional expressions, provides examples of various conditional judgments, and notes in practical applications."
                },
                {
                    objectID: "1-3-3",
                    title: "List Rendering",
                    path: "/base/template-for",
                    description:
                        "Explains the syntax and usage of list rendering in templates, including how to traverse data structures such as arrays and objects to generate dynamic list elements, and the handling methods of indexes, key values, etc. during the list rendering process."
                },
                {
                    objectID: "1-3-4",
                    title: "Block Rendering",
                    path: "/base/template-section",
                    description:
                        "Introduces the concept and implementation method of block rendering in templates, such as how to divide different template blocks and perform targeted rendering operations, and the application of block rendering in optimizing template structure and improving rendering efficiency."
                },
                {
                    objectID: "1-3-5",
                    title: "Event Registration",
                    path: "/base/template-event",
                    description:
                        "Explains the method of registering events in templates, including the registration syntax of various event types (such as click events, input events, etc.), the definition of event handling functions, and the way of passing parameters, and demonstrates the response mechanism of events in templates through examples."
                },
                {
                    objectID: "1-3-6",
                    title: "Built-in Properties",
                    path: "/base/template-property",
                    description:
                        "Introduces the built-in properties of templates themselves, which can be used to control the rendering behavior of templates, obtain template-related information, etc., and explains how to use these properties in templates to meet specific functional requirements."
                },
                {
                    objectID: "1-3-7",
                    title: "Component Styles",
                    path: "/base/style",
                    description:
                        "Explains the way of applying component styles in framework templates, including inline styles, the introduction of external style sheets, and the control of style scopes, and provides relevant knowledge of style naming conventions and style priority handling."
                }
            ]
        },
        {
            objectID: "1-4",
            title: "Rendering",
            description:
                "Analysis of the framework rendering mechanism, in-depth exploration of the rendering principle and key links.",
            children: [
                {
                    objectID: "1-4-1",
                    title: "Overview",
                    path: "/base/render",
                    description:
                        "Provides an overall overview of the framework's rendering principle, including the entire process from data change to page update, and introduces the main modules and key technical points involved, enabling readers to have a macro understanding of the rendering mechanism."
                },
                {
                    objectID: "1-4-2",
                    title: "AST",
                    path: "/base/ast",
                    description:
                        "Deeply explains the role of the Abstract Syntax Tree (AST) in framework rendering, including how to convert template code into an AST, the structure and node types of the AST, and how to optimize and generate the final rendering code based on the AST."
                },
                {
                    objectID: "1-4-3",
                    title: "VNode",
                    path: "/base/vnode",
                    description:
                        "Explains the concept, creation process, and role of virtual nodes (VNode) in the rendering process, shows how VNode interacts with and updates the real DOM, and the application of the VNode caching and reuse mechanism in improving rendering performance."
                }
            ]
        },
        {
            objectID: "1-5",
            title: "Data Response",
            description:
                "Principle and application of framework data response, interpretation of the core points of data response.",
            children: [
                {
                    objectID: "1-5-1",
                    title: "Data Proxy",
                    path: "/base/observer",
                    description:
                        "Details the data proxy mechanism, that is, how to access and modify the original data through the proxy object, including the creation process of the proxy object, the implementation methods of access interception and modification interception, and the role of data proxy in the data response system."
                },
                {
                    objectID: "1-5-2",
                    title: "Subscription",
                    path: "/base/watcher",
                    description:
                        "Explains the concept and implementation method of data subscription, including how to create subscriber objects, how to monitor data changes and trigger corresponding callback functions, and the importance of data subscription in achieving data-driven view updates."
                },
                {
                    objectID: "1-5-3",
                    title: "Combined Reply",
                    path: "/base/combined-reply",
                    description:
                        "Instructions on combination-related operations in data response, which may involve the coordinated operation of multiple data response methods and how to use the combination mechanism to achieve efficient data processing and view updates in complex data scenarios."
                }
            ]
        }
    ];

    export const ROUTER_MENUS = [
        {
            objectID: "2-1",
            title: "Start",
            description: "Router help documentation Router",
            children: [
                {
                    objectID: "2-1-1",
                    title: "Introduction",
                    path: "/router/introduction",
                    description:
                        "Provides an overall elaboration on the basic concepts and uses of the routing system to help users establish a preliminary understanding."
                },
                {
                    objectID: "2-1-2",
                    title: "Getting Started",
                    path: "/router/guide",
                    description:
                        "Provides getting-started steps and examples for using the router to guide newbies to quickly get started."
                }
            ]
        },
        {
            objectID: "2-2",
            title: "Basics",
            description: "Basic router documentation Router",
            children: [
                {
                    objectID: "2-2-1",
                    title: "Initialize Router",
                    path: "/router/init",
                    description:
                        "Explains how to initialize the router configuration in the project, including relevant parameters and setting methods."
                },
                {
                    objectID: "2-2-2",
                    title: "Register Router",
                    path: "/router/registry",
                    description: "Describes the way and key points of registering routing information into the system."
                },
                {
                    objectID: "2-2-3",
                    title: "View Container",
                    path: "/router/router-view",
                    description:
                        "Introduces the container component used to display the view corresponding to the route and its usage method."
                },
                {
                    objectID: "2-2-4",
                    title: "Route Navigation",
                    path: "/router/change",
                    description:
                        "Elaborates on different methods and scenarios of achieving route navigation in the application."
                }
            ]
        },
        {
            objectID: "2-3",
            title: "In-Depth Understanding",
            description: "In-depth understanding of Joker Router",
            children: [
                {
                    objectID: "2-3-1",
                    title: "Parameter Passing",
                    path: "/router/params",
                    description:
                        "Explains the mechanism and various implementation methods of parameter passing between routes."
                },
                {
                    objectID: "2-3-2",
                    title: "Nested Routes",
                    path: "/router/nested-routes",
                    description: "Tells how to create and use nested routes to build complex page layouts."
                },
                {
                    objectID: "2-3-3",
                    title: "Route Events/States",
                    path: "/router/event",
                    description:
                        "Introduces the event triggering mechanism and state management methods related to routes."
                },
                {
                    objectID: "2-3-4",
                    title: "Route Information",
                    path: "/router/route",
                    description: "Explains how to obtain and utilize various information during the routing process."
                },
                {
                    objectID: "2-3-5",
                    title: "State Preservation",
                    path: "/router/keepalive",
                    description:
                        "Explains the strategies and implementation means of maintaining page state during route switching."
                },
                {
                    objectID: "2-3-6",
                    title: "Scroll Behavior",
                    path: "/router/scroll",
                    description: "Describes the control method of the page scroll position during route switching."
                },
                {
                    objectID: "2-3-7",
                    title: "History Mode",
                    path: "/router/history",
                    description:
                        "Introduces the history mode of routes and its characteristics and application scenarios."
                }
            ]
        }
    ];

    export const CLI_MENUS = [
        {
            objectID: "3-1",
            title: "Start",
            description: "Joker CLI help documentation",
            children: [
                {
                    objectID: "3-1-1",
                    title: "Introduction",
                    path: "/cli/introduction",
                    description:
                        "Provides a preliminary description of the basic situation, functional scope, and application scenarios of the CLI scaffolding, enabling users to have an overall concept."
                },
                {
                    objectID: "3-1-2",
                    title: "Getting Started",
                    path: "/cli/guide",
                    description:
                        "Provides getting-started steps for using the CLI scaffolding, including basic operations such as installation and project initialization, to help newbies quickly get started."
                }
            ]
        },
        {
            objectID: "3-2",
            title: "In-Depth Understanding",
            description: "In-depth understanding of Joker CLI",
            children: [
                {
                    objectID: "3-2-1",
                    title: "Variables and Modes",
                    path: "/cli/define",
                    description:
                        "Details the variable definition and usage modes involved in the CLI scaffolding, and how to flexibly configure the project through these variables."
                },
                {
                    objectID: "3-2-2",
                    title: "Dependency Pre-Building",
                    path: "/cli/dep",
                    description:
                        "Explains the principle, process, and importance of dependency pre-building in CLI scaffolding projects, including how to optimize dependency processing to improve project building speed."
                },
                {
                    objectID: "3-2-3",
                    title: "Build Production Version",
                    path: "/cli/prod",
                    description:
                        "Describes how to use the CLI scaffolding to build a production version of the project, covering relevant configuration options, optimization strategies, and the structure and characteristics of the generated files."
                }
            ]
        },
        {
            objectID: "3-3",
            title: "Configuration",
            description: "Joker CLI configuration instructions",
            children: [
                {
                    objectID: "3-3-1",
                    title: "Public Configuration",
                    path: "/cli/setting-public",
                    description:
                        "Introduces the public configuration items applicable to various scenarios in the CLI scaffolding, including the meaning, default values, and how to adjust them according to project requirements."
                },
                {
                    objectID: "3-3-2",
                    title: "Development Server",
                    path: "/cli/setting-server",
                    description:
                        "Explains the relevant configuration for providing services during the development process, such as the parameter settings for starting the local development server, the configuration of the hot update function, and the integration with development tools."
                },
                {
                    objectID: "3-3-3",
                    title: "Production Build",
                    path: "/cli/setting-build",
                    description:
                        "Describes the specific configuration for production builds, including code compression, resource optimization, packaging strategies, etc., to ensure the performance and stability of the production version."
                }
            ]
        },
        {
            objectID: "3-4",
            title: "Plugins",
            description: "Joker CLI plugins",
            children: [
                {
                    objectID: "3-4-1",
                    title: "Use Plugins",
                    path: "/cli/plugin-use",
                    description:
                        "Provides methods and steps for using existing plugins, including how to install, configure, and enable plugins in the CLI scaffolding project, and how to use plugins to extend project functions."
                },
                {
                    objectID: "3-4-2",
                    title: "Create Plugins",
                    path: "/cli/plugin-create",
                    description:
                        "Tells how to develop custom plugins, covering the basic structure, development specifications, interface definitions, and how to integrate them into the CLI scaffolding ecosystem."
                },
                {
                    objectID: "3-4-3",
                    title: "Optional Plugins",
                    path: "/cli/plugins",
                    description:
                        "Lists some commonly used optional plugins and briefly introduces their functions, characteristics, and applicable scenarios to help users select suitable plugins according to project requirements."
                }
            ]
        }
    ];

    export const REQUESTER_MENUS = [
        {
            title: "Plugins",
            objectID: "4-1",
            description: "",
            children: [
                {
                    objectID: "4-1-1",
                    title: "Request",
                    path: "/requester",
                    description:
                        "Requester is a class designed to handle HTTP requests. It offers pre-request, post-request, and error-handling callbacks, supports features such as request caching, timeout handling, and Mock data. Additionally, it allows for customizing the transformation of request and response data, as well as the error-handling logic."
                }
            ]
        }
    ];

    export let allMenus = [...BASE_MENUS, ...ROUTER_MENUS, ...CLI_MENUS, ...REQUESTER_MENUS];
}
