## 使用插件

该章节主要介绍如何使用插件。

Joker CLI 支持通过插件进行功能扩展，得益于 `Rollup` 强大的插件接口和 Joker CLI 特有的附加配置选项。这使得 Joker CLI 的用户能够充分利用 `Rollup` 丰富的插件生态系统来增强工具的功能。

### 如何使用

为了使用插件，您需要先将其添加到项目的 `devDependencies` 文件中，然后在项目的 `joker.config.js` 配置文件里的 `plugins` 数组中引入该插件。例如，如果您希望支持传统浏览器，您可以这样使用官方提供的插件 `@('@joker.front/cli-plugin-legacy')`：

```js
const { legacyPlugin } = require("@joker.front/cli-plugin-legacy");

module.exports = {
    plugins: [
        legacyPlugin({
            targets: ["chrome 80", "ie >= 10"]
        })
    ]
};
```

### 插件排序

为了确保与特定的 Rollup 插件兼容，可能需要在构建过程中对插件的执行顺序进行调整，或者专门在构建时启用这些插件。这类操作通常是 Joker CLI 插件实现的内部机制。您可以使用 `enforce` 修饰符来控制插件的位置：

-   `pre`：确保插件在 Joker CLI 核心插件之前执行。
-   `default`：插件将在 Joker CLI 核心插件之后按顺序执行。
-   `post`：插件将在 Joker CLI 构建过程完成后执行。

通过这种方式，您可以精细控制插件的执行时机，以满足不同的需求。

```js
// joker.config.js
const image = require("@rollup/plugin-image");

module.exports = {
    plugins: [
        {
            ...image(),
            enforce: "pre"
        }
    ]
};
```

### 按需引用

默认情况下，插件会在开发（serve）和生产（build）模式下都被调用。如果您希望插件仅在特定模式下按需使用，可以通过设置 `apply` 属性来指定插件仅在 'build' 或 'serve' 模式中调用：

```js
const image = require("@rollup/plugin-image");

module.exports = {
    plugins: [
        {
            ...image(),
            //仅在build模式下该插件生效
            apply: "build"
        }
    ]
};
```
