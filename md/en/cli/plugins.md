## Optional Plugins 

This chapter introduces the official Joker CLI plugins.

### @('@joker.front/cli-plugin-legacy')

This plugin primarily handles compatibility transformations.

By default, Joker CLI only performs syntax transformations and does not include any polyfills. If you need support for legacy browsers, you can visit [Polyfill.io](https://polyfill.io/), a service that automatically generates polyfill bundles based on the user's browser User-Agent.

For scenarios requiring compatibility with legacy browsers, you can install and use the `@('@joker.front/cli-plugin-legacy')` plugin. This plugin automatically generates optimized versions for legacy browsers along with necessary polyfills to ensure proper functionality. These compatibility chunks are loaded on-demand only when the target browser lacks native ESM support.

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

This plugin offers the following optional configurations:

```ts
export interface Option {
    /**
     * Target platforms
     * @default 'defaults'
     */
    targets?: string | string[];
    /**
     * Legacy bundle filename suffix
     * @default '-legacy'
     */
    legacyName?: string;
    /**
     * Use external SystemJS
     */
    externalSystemJs?: boolean;
    /**
     * Modern browser polyfills
     */
    modernPolyfills?: string[];
    /**
     * Legacy browser polyfill mechanism
     */
    legacyPolyfills?: string[];
}
```

#### targets

-   Type: `string | string[] | { [key: string]: string }`
-   Default: `last 2 versions and not dead, >0.3%, Firefox ESR`

When generating legacy chunks, if explicitly set, this value is passed to `@('@babel/preset-env')`.  
The query is also compatible with Browserslist. For details, refer to [Browserslist](https://github.com/browserslist/browserslist#best-practices) best practices.

If unset, plugin-legacy will load the browserslist configuration source and fall back to the default value.

#### legacyName

-   Type: `string`
-   Default: `-legacy`

Configures the suffix for compatibility bundles.

#### externalSystemJs

-   Type: `boolean`
-   Default: `false`

When false (default), the plugin includes systemjs/dist/s.min.js in polyfills-legacy chunks.  
When true, the SystemJS dependency is excluded.

#### modernPolyfills

-   Type: `boolean | string[]`
-   Default: `false`

When false (default), no separate polyfills chunk is generated for modern builds (targeting browsers with widely available features).  

Set to a string array to explicitly control included polyfills. Refer to Polyfill Specifiers for details.  
Note: Using `true` (auto-detection) is discouraged because `core-js3` aggressively includes polyfills for all cutting-edge features – potentially adding **15kb** even for native ESM browsers!  

If your project doesn't heavily rely on bleeding-edge features, avoiding modern polyfills entirely is feasible. As an alternative, consider on-demand services like Polyfill.io to inject only necessary polyfills per user agent (most modern browsers require none).

#### legacyPolyfills

By default, a polyfill chunk is generated based on target browser ranges and actual usage detected via `@babel/preset-env`'s `useBuiltIns: 'usage'`.  
Set to a string array to explicitly control included polyfills. Refer to Polyfill Specifiers for details.

Polyfill specifier strings for both `legacyPolyfills` and `modernPolyfills` can be either:

-   `core-js 3 sub-import paths` – e.g., `es/map` imports `core-js/es/map` [link](https://unpkg.com/browse/core-js@3.35.1/)  
-   `Individual core-js 3 modules` – e.g., `es.array.iterator` imports `core-js/modules/es.array.iterator.js` [link](https://unpkg.com/browse/core-js@3.35.1/modules/)  

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