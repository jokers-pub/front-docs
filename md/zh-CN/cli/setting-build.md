## 生产构建(build)配置

该章节主要介绍配置文件中`build`属性的配置说明，该属性类型为`BuildOptions`。

```js
module.exports = {
    build: {
        //...
    }
};
```

### write

-   类型：`boolean`
-   默认：`true`

是否输出文件，默认为`true`，当我们只是作为调试或者测试场景时，可以设置为`false`。

### target

-   类型：`string | string[]`
-   默认：`["es2020", "edge88", "firefox78", "chrome87", "safari13"]`

指定您希望最终构建的浏览器兼容目标版本。
请注意：如果您的代码包含 esbuild 无法安全编译的特性，构建过程将会失败。您可以通过查阅 [esbuild](https://esbuild.github.io/content-types/#javascript) 文档 来了解更多详细信息。

### rollupOptions

-   类型：`RollupOptions`
-   默认：`{}`

您可以自定义底层的 Rollup 打包配置，这些配置将与从 Rollup 配置文件中导出的选项相同，并且会与 Joker CLI 内部的 Rollup 选项进行合并。欲了解更多关于 Rollup 选项的信息，请查阅 [Rollup 选项文档](https://rollupjs.org/configuration-options/)。

### outDir

-   类型：`string`
-   默认：`dist`

指定输出文件的路径，该路径应相对于项目的主目录。

### sourcemap

-   类型：`boolean`
-   默认：`false`

决定是否在构建完成后生成源映射文件。如果设置为 `true`，将生成一个单独的源映射文件。 Joker CLI 只支持创建一个独立的 source map 文件的方式来生成 sourmap，不支持`inline`、`hidden`等场景。

### assetsDir

-   类型：`string`
-   默认：`assets`

指定生成静态资源的存放路径（相对于 build.outDir）。在 `库模式` 下不能使用。

若你不想让 Joker CLI 创建资源文件夹，你可以配置为`''`空字符。

### assetsInlineLimit

-   类型：`number`
-   默认：`4096`（4Kib）

资源导入或引用的阈值以下，将被内联为 base64 编码，以减少不必要的 HTTP 请求。若将此值设为 `0`，将关闭此功能。

> 当设置了 `build.lib` 属性时，`build.assetsInlineLimit` 将无效。

### minify

-   类型：`boolean | "esbuild" | "terser"`
-   默认：`true`

当选项设置为 `true` 时，表示压缩过程将使用 `esbuild` 工具。将此选项设置为 `false` 可禁用压缩混淆功能，或者用于指定其他混淆器。默认情况下，使用 Esbuild 作为混淆器，它比 Terser 快 20-40 倍，且压缩率相差仅 1%-2%。

请注意，在 `lib` 模式下，如果使用 `esbuild` 作为混淆器，`build.minify` 选项将不会缩减空格，因为这样做会移除 `pure` 标记，从而影响摇树优化（tree-shaking）。

若选择 `terser` 作为混淆器，则必须先安装 Terser 工具。

```bash
pnpm add terser
```

### lib

-   类型：`LibraryOptions | false`
-   默认：`false`

可通过配置该属性来开启`库模式`。

其中`LibraryOptions`类型为：

```ts
export interface LibraryOptions {
    /**
     * 入口文件
     */
    entry: string;
    /**
     * 别名
     */
    name?: string;
    /**
     * 输出类型
     * @default [es,umd]
     */
    formats?: LibraryFormatType[];

    /**
     * 输出文件名称，不配置则按原文件输出
     */
    fileName?: string | ((format: ModuleFormat) => string);
}

export type LibraryFormatType = "es" | "cjs" | "umd" | "iife";
```

### chunkSizeWarningLimit

-   类型：`number`
-   默认：`500`

设置一个阈值，以千字节（kB）为单位，用于触发警告提示，该阈值用于比较未压缩的代码块（chunk）的大小。由于 JavaScript 代码的大小与其执行时间相关联，因此这个阈值有助于识别可能需要优化的代码块。

### cssTraget

-   类型：`string | string[]`
-   默认：`["es2020", "edge88", "firefox78", "chrome87", "safari13"]`

此设置允许用户为 CSS 压缩指定一个独特的浏览器目标，这个目标与 JavaScript 转写目标不同。

此设置应主要针对非主流或特定版本的浏览器使用。例如，当你需要确保代码兼容安卓微信中的 webview 时，这种 webview 支持大部分现代 JavaScript 功能，但不支持 CSS 中的 RGBA 十六进制颜色值。在这种情况下，将`build.cssTarget`设置为`chrome61`可以防止 Joker CLI 将 RGBA 颜色值转换为 CSS 的#RGBA 十六进制形式，从而确保兼容性。

### copyPublicDir

-   类型：`boolean`
-   默认：`true`

默认在构建后会将`publicDir`文件夹复制到`outDir`目录，若不需要复制，可配置为**false**。

### publicBaseDir

-   类型：`string`
-   默认：`true`

构建时可通过配置该属性来控制输出后的静态公共资源的路径，若不配置则使用`config.base`来统一设置根地址。

### worker worker 编译扩展信息

-   类型 `{ rollupOptions?: RollupOptions; plugins?: (input: string) => Promise<RollupPlugin> }`

通过该属性可实现对 worker 编译时的自定义扩展。
