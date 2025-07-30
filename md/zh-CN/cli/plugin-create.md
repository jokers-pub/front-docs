## 创建插件

Joker CLI 插件构建在优秀的 Rollup 插件架构之上，并引入了专为 Joker CLI 设计的独特配置选项。这意味着，一旦编写了一个 Joker CLI 插件，它就可以在开发和生产环境中无缝工作，无需额外配置。

在阅读本章节前，请先学习[Rollup 插件](https://rollupjs.org/plugin-development/#plugins-overview)的相关知识，本章节主要介绍 Joker CLI 的一些自有属性。

### 命名

我们建议所有 Joker CLI 的插件命名都以`@('@joker.front/cli-')`作为前缀进行命名，以确保开发人员在引用它时能通过名称来快速区分类库的类型。

### 简单的示例

```js
const fileRegex = /\.(my-file-ext)$/;

export default function myPlugin() {
    return {
        name: "transform-file",

        transform(src, id) {
            if (fileRegex.test(id)) {
                return {
                    code: compileFileToJS(src),
                    map: null // 如果可行将提供 source map
                };
            }
        }
    };
}
```

### enforce

-   类型：`"pre" | "post"`

可指定该插件的执行顺序。

-   `pre`：确保插件在 Joker CLI 核心插件之前执行。
-   `default`：插件将在 Joker CLI 核心插件之后按顺序执行。
-   `post`：插件将在 Joker CLI 构建过程完成后执行。

### apply

-   类型：`"build" | "server"`

用于指定该插件在哪些环境才生效，默认不设置时，代表在所有模式下都执行该插件。

### configureServer

-   类型：`(server: Server) => void | Promise<void>`

是用于配置开发服务器的钩子。我们可以通过该 HOOK 实现`server`对象的存储和其它配置。

```js
const myPlugin = () => ({
    name: "configure-server",
    configureServer(server) {
        // 返回一个在内部中间件安装后
        // 被调用的后置钩子
        return () => {
            server.middlewares.use((req, res, next) => {
                // 自定义请求处理...
            });
        };
    }
});

const myPlugin = () => {
    let server;
    return {
        name: "configure-server",
        configureServer(_server) {
            server = _server;
        },
        transform(code, id) {
            if (server) {
                // 使用 server...
            }
        }
    };
};
```

### configTransform

-   类型：`(config: ResolvedConfig) => Promise<void> | void`

通过该 HOOK 可对`config`进行一些配置。我们可以在该方法内对某一个属性配置默认值，也可以对传入的 `config` 进行二次加工处理。

### indexHtmlTransform

该属性用于扩展对`html`的转换，它的配置规则：

```ts
export type IndexHtmlTransformHook = (
    content: string,
    option: IndexHtmlTransformOption
) => IndexHtmlTransformResult | void | Promise<IndexHtmlTransformResult | void>;

export type IndexHtmlTransform =
    | IndexHtmlTransformHook
    | {
          enforce?: Plugin["enforce"];
          transform: IndexHtmlTransformHook;
      };
```

这个功能允许异步操作，并能够返回以下几种形式中的一种：

-   转换后的 HTML 字符串。
-   描述标签的属性对象数组，用以注入现有的 HTML 中，其中每个标签也可以定义其插入位置（默认在 <head> 标签之前）。
-   一个包含 `{ html, tags }` 的对象。

例如：将 title 转换为指定值

```js
const htmlPlugin = () => {
    return {
        name: "html-transform",
        transformIndexHtml(html) {
            return html.replace(/<title>(.*?)<\/title>/, `<title>Title replaced!</title>`);
        }
    };
};
```

### hmrUpdate

HMR 热更新处理钩子函数。该函数只在`server`模式下生效。

```ts
    /**
     * 热更新模块Update上下文
     * 可以通过该hook实现对modules等属性的更新
     * @param ctx
     */
    hmrUpdate?(ctx: HMRContext, server: Server): ModuleNode[] | void | Promise<ModuleNode[] | void>;
```

我们可以通过配置该函数来监听并自定义处理热更新。

```ts
    hmrUpdate(ctx, server) {
        if (filter(ctx.file) === false) {
            return;
        }

        return hotUpdate(config, ctx, server);
    },
```
