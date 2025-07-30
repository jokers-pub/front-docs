## 可选插件

本章主要介绍官方提供的 Joker CLI 插件。

### @('@joker.front/cli-plugin-legacy')

该插件主要负责兼容性转换。

Joker CLI 在默认情况下仅处理语法转换，不包含任何 polyfill。如果您需要为老旧浏览器提供支持，可以访问[Polyfill.io](https://polyfill.io/)，这是一个可以根据用户浏览器的 User-Agent 自动生成 polyfill 包的服务。

对于需要兼容传统浏览器的场景，可以通过安装并使用插件 `@('@joker.front/cli-plugin-legacy')` 来支持。这个插件会自动生成适合老旧浏览器的版本和必要的 polyfill，以确保在这些浏览器上正确运行。这些兼容性版本的 chunk 只有在目标浏览器不支持原生 ESM 时才会被按需加载。

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

该插件提供以下可选配置：

```ts
export interface Option {
    /**
     * 目标平台
     * @default 'defaults'
     */
    targets?: string | string[];
    /**
     * 兼容版本文件名称
     * @default '-legacy'
     */
    legacyName?: string;
    /**
     * 是否采用外部SystemJs
     */
    externalSystemJs?: boolean;
    /**
     * 现代浏览器兼容性
     */
    modernPolyfills?: string[];
    /**
     * 老浏览器兼容处理机制
     */
    legacyPolyfills?: string[];
}
```

#### targets

-   类型：`string | string[] | { [key： string]: stirng }`
-   默认值：`last 2 versions and not dead, >0.3%, Firefox ESR`

当渲染传统块时，如果显式设置，它会被传递给 `@('@babel/preset-env')`。
该查询也兼容 Browserslist。有关详细信息，请参见 [Browserslist](https://github.com/browserslist/browserslist#best-practices) 最佳实践。

如果没有设置，plugin-legacy 将加载 browserslist 配置源，然后回退到默认值。

#### legacyName

-   类型：`string`
-   默认值：`-legacy`

用于配置兼容性文件的后缀名。

#### externalSystemJS

-   类型：`boolean`
-   默认值：`false`

默认值为 false。启用此选项将在 polyfills-legacy 块中排除 systemjs/dist/s.min.js。

#### modernPolyfills

-   类型： `boolean | string[]`
-   默认值： `false`

默认值为 false。启用此选项将在现代构建中生成一个单独的 polyfills 块（针对支持广泛可用特性的浏览器）。

设置为字符串数组以显式控制要包含的 polyfills。有关详细信息，请参见 Polyfill 指定符。
请注意，不建议使用 true 值（使用自动检测），因为 `core-js3` 非常激进地包含 polyfills，因为它支持所有前沿特性。即使针对本地 ESM 支持，它也会注入 **15kb** 的 polyfills！

如果你不是特别依赖前沿运行时特性，完全有可能避免在现代构建中使用 polyfills。作为一种替代方案，可以考虑使用按需服务，如 Polyfill.io，仅根据实际浏览器用户代理注入必要的 polyfills（大多数现代浏览器不需要任何东西）。

#### legacyPolyfills

默认情况下，会根据目标浏览器范围和最终捆绑包中的实际使用情况生成一个 polyfills 块（通过@babel/preset-env 的 useBuiltIns: 'usage'检测）。
设置为字符串数组以显式控制要包含的 polyfills。有关详细信息，请参见 Polyfill 指定符。

`legacyPolyfills`和`modernPolyfills`的 Polyfill 指定符字符串可以是以下任意一种：

-   `core-js 3的子导入路径` - 例如，es/map 将导入 core-js/es/map [连接](https://unpkg.com/browse/core-js@3.35.1/)
-   `单独的core-js 3模块` - 例如，es.array.iterator 将导入 core-js/modules/es.array.iterator.js [连接](https://unpkg.com/browse/core-js@3.35.1/modules/)

```js
const { legacyPlugin } = require("@joker.front/cli-plugin-legacy");

module.exports = {
    plugins: [
        legacyPlugin({
            targets: ["chrome 80", "ie >= 10"],
            legacyPolyfills: ["es.promise.finally", "es/map", "es/set"],
            modernPolyfills: ["es.promise.finally"]
        })
    ]
};
```
