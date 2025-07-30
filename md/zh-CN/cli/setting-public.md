## 公共配置

该章节主要介绍 Joker CLI 提供的配置文件规范及说明。

### 如何使用配置文件

除了使用 Joker CLI 的命令行参数（如：--log）进行配置外，您还可以通过创建专门的配置文件来设置 Joker CLI 的执行参数。采用配置文件方式，不仅能够满足更加复杂的的功能需求，还能够为`rollup`提供详细的配置指令。这种方式提高了配置的灵活性和便捷性，有助于提升使用体验和效率。

我们可以创建`js`文件来作为配置文件，配置文件可以存放在项目的任何位置，例如：`build/dev.config.js`，并且你也可以创建多个配置文件例如根据环境我们可以创建：

-   `dev.server.js` 开发 server 环境配置
-   `dev.build.js` 开发环境 build 环境配置
-   `prod.config.js` 生产构建配置
-   `st.config.js` 安全测试(Security Testing)环境配置
-   等等

我们可以在`package.json`中的**script**中创建多个执行命令，并选择不同的配置文件：

```json
{
    "scripts": {
        "dev": "joker --config=dev.config.js",
        "build": "joker build --config=build.config.js"
    }
}
```

我们可以通过`config`属性来指定不同的配置文件。

配置配文件采用的是[CommonJS](https://wiki.commonjs.org/wiki/CommonJS)规范，我们可以通过`module.exports`来导出我们的配置信息。

```js
module.exports = {
    root: "./src"
};
```

接下来我们将介绍下配置文件中的属性配置：

### root

-   类型：`string`
-   默认：`process.cwd()`

当指定 `root` 参数时，它定义了应用程序的起始目录。这个目录可以是绝对路径，也可以是相对于当前工作目录`process.cwd()`的相对路径。应用程序将从这个指定的根目录开始执行，所有相对于该目录的路径都会基于它进行解析。

### base

-   类型：`string`
-   默认：`/`

在开发或生产环境中，服务公共基础路径可以采用以下合法值：

-   绝对路径名，如 `/base/`，这意味着路径从网站的根目录开始。
-   完整的 URL，例如 `https://base.com/`，在开发环境中，原始的 URL 部分不会被使用，只起到占位符的作用。
-   空字符串或 `./`，这用于开发环境中的嵌入式服务，表示当前目录。

### mode

-   类型：`string`
-   默认：`development`

`mode` 参数用于指定应用程序的运行模式，支持设置为 `development` 或 `production`。这两个模式分别对应开发环境和生产环境。当模式被配置后，可以通过环境变量进行访问和利用。

### command

-   类型：`string`
-   默认：`server`

`command` **不允许**配置，它用来指示当前的命令模式。在 Joker CLI 启动过程中，`command` 的值会被自动设置。例如，`server` 表示启动开发服务模式，而 `build` 则代表执行构建模式。

### server

-   类型：`ServerOptions`

> 详细配置请参阅[开发服务](/cli/setting-server)配置说明。

### build

-   类型：`BuildOptions`

> 详细配置请参阅[生产构建](/cli/setting-build)配置说明。

### cacheDir

-   类型：`string`
-   默认：`node_modules/.joker`

定义缓存目录，存放 dep 依赖缓存等文件，默认为 package.json 所在文件夹下的 node_modules/.joker。详细内容可参阅[依赖预构建](/cli/dep)。

### publicDir

-   类型：`string|false`
-   默认：`public`

静态资源服务文件夹用于存放在开发和构建过程中不需要变化的资源文件。在开发阶段，这些文件位于项目根目录的 `/` 位置，便于直接访问。在构建阶段，这些文件会被复制到指定的 `outDir` 根目录下，保持原样提供给用户，无需任何转换。该路径可以是文件系统中的绝对路径，也可以是相对于项目根目录的相对路径。

如果将 `publicDir` 设置为 `false`，则会禁用这一功能。

### logLeve

-   类型：`"silent" | "error" | "warn" | "info" | "debug"`
-   默认：`info`

日志输出等级，默认为`info`，若你想了解 Joker CLI 运行机制或需要调试 Joker CLI，你可以将其配置为`debug`。

### esbuild

-   类型：`boolean`
-   默认：`true`

默认情况下，esbuild 会被应用在 `ts` 文件的编译环节。

当你需要自定义的`ts`编译，你可以将其配置为`false`来关闭 `esbuild` 功能。

### assetsInclude

-   类型：`string[]`
-   默认：`参考下面ASSET_TYPES内容`

用过配置额外处理的资源类型，我们可以实现：

-   当这些资源通过 HTML 引用，或者通过 fetch 或 XHR 请求时，它们将不会被插件的转换管道处理。
-   如果你尝试从 JavaScript 中导入这些资源，你将得到一个解析后的 URL 字符串作为结果。然而，如果你使用了 `enforce: 'pre'` 插件来处理不同类型的资产，这个行为可能会发生变化。
    你可以查看内置的资源类型列表以获取更多信息。

Joker CLI 默认已经将以下类型作为资源类型处理：

```ts
export const ASSET_TYPES: string[] = [
    // images
    "png",
    "jpe?g",
    "jfif",
    "pjpeg",
    "pjp",
    "gif",
    "svg",
    "ico",
    "webp",
    "avif",

    // media
    "mp4",
    "webm",
    "ogg",
    "mp3",
    "wav",
    "flac",
    "aac",

    // fonts
    "woff2?",
    "eot",
    "ttf",
    "otf",

    // other
    "webmanifest",
    "pdf",
    "txt"
];
```

在该属性中，你可以定义新的扩展类型。Joker CLI 会将这些自定义扩展与默认扩展结合，共同构成资源扩展值。

### plugins

-   类型：`Plugin[] | Array<Plugin[]>`

> Joker CLI 插件，详细内容请参阅[创建插件](#cli/plugin-create)。

### resolve

-   类型：`ResolveOptions`
-   默认：`{}`

该属性用于配置解析器，我们可以通过设置内部的`mainFields`及`extensions`属性来进行解析配置。

#### resolve.mainFields

-   类型：`string[]`
-   默认：`["browser","module", "jsnext:main", "jsnext"]`

在 `package.json` 中，`resolve.mainFields` 定义了在解析包的入口点时尝试查询的字段列表。请注意，这个列表的优先级低于从 `exports` 字段中解析入口点的优先级：如果通过 `exports` 字段成功找到了入口点，`resolve.mainFields` 将不会被考虑。

#### resolve.extensions

-   类型：`string[]`
-   默认：`[".js", "mjs", "mts", ".ts", ".json"]`

为了在导入时省略特定的扩展名，需谨慎行事，尤其是对于自定义导入类型的扩展名。避免这样做，以免影响 IDE 和类型支持的正常功能。

### define

-   类型：`Record<string, any>`
-   默认：`{}`

环境变量配置，详细请参阅[变量与模式](/cli/define)。

### css

-   类型：`CSSOptions`
-   默认：`{}`

CSS 配置。可通过配置`preprocessorOptions`、`enableSourceMap`来扩展 css 编译功能。

#### css.preprocessorOptions

-   类型：`Record<string, any>`
-   默认：`{}`

指定传递给 CSS 预处理器的选项时，文件扩展名将作为选项的键。关于每个预处理器所支持的选项，具体信息可以在相应的官方文档中查找到：

-   [sass/scss](https://sass-lang.com/documentation/js-api/interfaces/legacystringoptions/)
-   [less](https://lesscss.org/usage/#less-options)

```json
{
    "sass": {
        "includePaths": ["node_modules"]
        //...
    }
}
```

#### enableSourceMap

-   类型：`boolean`
-   默认：`false`

是否启用 sourcemap。
