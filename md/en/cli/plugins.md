## Optional Plugins

This chapter mainly introduces the official Joker CLI plugins.

### @('@joker.front/cli-plugin-legacy')

This plugin is mainly responsible for compatibility transformation.

By default, Joker CLI only handles syntax transformation and does not include any polyfills. If you need to provide support for older browsers, you can visit [Polyfill.io](https://polyfill.io/), a service that can automatically generate polyfill packages based on the user's browser User - Agent.

For scenarios that require compatibility with traditional browsers, you can support them by installing and using the plugin `@('@joker.front/cli-plugin-legacy')`. This plugin will automatically generate versions suitable for older browsers and the necessary polyfills to ensure correct operation on these browsers. These compatibility - version chunks will only be loaded on - demand when the target browser does not support native ESM.

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

This plugin provides the following optional configurations:

```ts
export interface Option {
    /**
     * Target platforms
     * @default 'defaults'
     */
    targets?: string | string[];
    /**
     * Name of the compatibility version file
     * @default '-legacy'
     */
    legacyName?: string;
    /**
     * Whether to use external SystemJs
     */
    externalSystemJs?: boolean;
    /**
     * Compatibility for modern browsers
     */
    modernPolyfills?: string[];
    /**
     * Compatibility handling mechanism for old browsers
     */
    legacyPolyfills?: string[];
}
```

#### targets

-   **Type**: `string | string[] | { [key: string]: string }`
-   **Default value**: `last 2 versions and not dead, >0.3%, Firefox ESR`

When rendering the legacy chunk, if explicitly set, it will be passed to `@('@babel/preset-env')`.
This query is also compatible with Browserslist. For more details, see [Browserslist](https://github.com/browserslist/browserslist#best - practices) best practices.

If not set, plugin - legacy will load the browserslist configuration source and then fallback to the default value.

#### legacyName

-   **Type**: `string`
-   **Default value**: `-legacy`

Used to configure the suffix name of the compatibility file.

#### externalSystemJS

-   **Type**: `boolean`
-   **Default value**: `false`

The default value is false. Enabling this option will exclude systemjs/dist/s.min.js from the polyfills - legacy chunk.

#### modernPolyfills

-   **Type**: `boolean | string[]`
-   **Default value**: `false`

The default value is false. Enabling this option will generate a separate polyfills chunk in the modern build (for browsers that support widely available features).

Set it to an array of strings to explicitly control the polyfills to be included. For more details, see Polyfill specifiers.
Note that the `true` value (using auto - detection) is not recommended because `core - js3` is very aggressive in including polyfills as it supports all cutting - edge features. Even for native ESM support, it will inject **15kb** of polyfills!

If you are not particularly dependent on cutting - edge runtime features, it is entirely possible to avoid using polyfills in the modern build. As an alternative, consider using an on - demand service like Polyfill.io to inject only the necessary polyfills based on the actual browser user - agent (most modern browsers don't need anything).

#### legacyPolyfills

By default, a polyfills chunk will be generated based on the target browser range and the actual usage in the final bundle (detected by `@babel/preset - env`'s `useBuiltIns: 'usage'`).
Set it to an array of strings to explicitly control the polyfills to be included. For more details, see Polyfill specifiers.

The Polyfill specifier strings for `legacyPolyfills` and `modernPolyfills` can be any of the following:

-   A sub - import path of `core - js 3` - for example, `es/map` will import `core - js/es/map` [link](https://unpkg.com/browse/core - js@3.35.1/)
-   A separate `core - js 3` module - for example, `es.array.iterator` will import `core - js/modules/es.array.iterator.js` [link](https://unpkg.com/browse/core - js@3.35.1/modules/)

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
