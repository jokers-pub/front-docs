## Production Build (build) Configuration

This section mainly introduces the configuration instructions for the `build` property in the configuration file. The type of this property is `BuildOptions`.

```js
module.exports = {
    build: {
        //...
    }
};
```

### write

-   **Type**: `boolean`
-   **Default**: `true`

Whether to output files. The default is `true`. When you are in a debugging or testing scenario, you can set it to `false`.

### target

-   **Type**: `string | string[]`
-   **Default**: `["es2020", "edge88", "firefox78", "chrome87", "safari13"]`

Specify the browser compatibility target version you want for the final build.

Note: If your code contains features that esbuild cannot safely compile, the build process will fail. You can refer to the [esbuild](https://esbuild.github.io/content-types/#javascript) documentation for more detailed information.

### rollupOptions

-   **Type**: `RollupOptions`
-   **Default**: `{}`

You can customize the underlying Rollup packaging configuration. These configurations will be the same as the options exported from the Rollup configuration file and will be merged with Joker CLI's internal Rollup options. To learn more about Rollup options, please refer to the [Rollup Options Documentation](https://rollupjs.org/configuration-options/).

### outDir

-   **Type**: `string`
-   **Default**: `dist`

Specify the path for output files. This path should be relative to the project's main directory.

### sourcemap

-   **Type**: `boolean`
-   **Default**: `false`

Determine whether to generate source map files after the build is completed. If set to `true`, a separate source map file will be generated. Joker CLI only supports generating source maps by creating an independent source map file and does not support scenarios such as `inline` or `hidden`.

### assetsDir

-   **Type**: `string`
-   **Default**: `assets`

Specify the storage path for generated static resources (relative to `build.outDir`). It cannot be used in `Library Mode`.

If you don't want Joker CLI to create a resource folder, you can configure it as an empty string `''`.

### assetsInlineLimit

-   **Type**: `number`
-   **Default**: `4096` (4Kib)

Resources imported or referenced below this threshold will be inlined as base64-encoded to reduce unnecessary HTTP requests. If you set this value to `0`, this feature will be disabled.

> When the `build.lib` property is set, `build.assetsInlineLimit` will be invalid.

### minify

-   **Type**: `boolean | "esbuild" | "terser"`
-   **Default**: `true`

When the option is set to `true`, it means the `esbuild` tool will be used for the compression process. Setting this option to `false` can disable the compression and obfuscation function, or it can be used to specify other obfuscators. By default, Esbuild is used as the obfuscator. It is 20-40 times faster than Terser, and the compression ratio difference is only 1%-2%.

Note that in `lib` mode, if `esbuild` is used as the obfuscator, the `build.minify` option will not reduce whitespace because doing so will remove the `pure` markers, thus affecting tree-shaking.

If you choose `terser` as the obfuscator, you must first install the Terser tool.

```bash
pnpm add terser
```

### lib

-   **Type**: `LibraryOptions | false`
-   **Default**: `false`

You can enable `Library Mode` by configuring this property.

The `LibraryOptions` type is as follows:

```ts
export interface LibraryOptions {
    /**
     * Entry file
     */
    entry: string;
    /**
     * Alias
     */
    name?: string;
    /**
     * Output type
     * @default [es,umd]
     */
    formats?: LibraryFormatType[];

    /**
     * Output file name. If not configured, it will be output as the original file.
     */
    fileName?: string | ((format: ModuleFormat) => string);
}

export type LibraryFormatType = "es" | "cjs" | "umd" | "iife";
```

### chunkSizeWarningLimit

-   **Type**: `number`
-   **Default**: `500`

Set a threshold in kilobytes (kB) to trigger a warning prompt. This threshold is used to compare the size of uncompressed code chunks. Since the size of JavaScript code is related to its execution time, this threshold helps identify code chunks that may need optimization.

### cssTraget

-   **Type**: `string | string[]`
-   **Default**: `["es2020", "edge88", "firefox78", "chrome87", "safari13"]`

This setting allows users to specify a unique browser target for CSS compression, which is different from the JavaScript transpilation target.

This setting should be mainly used for non-mainstream or specific-version browsers. For example, when you need to ensure that your code is compatible with the webview in Android WeChat, which supports most modern JavaScript features but does not support RGBA hexadecimal color values in CSS. In this case, setting `build.cssTarget` to `chrome61` can prevent Joker CLI from converting RGBA color values to the CSS #RGBA hexadecimal form, thus ensuring compatibility.

### copyPublicDir

-   **Type**: `boolean`
-   **Default**: `true`

By default, after the build, the `publicDir` folder will be copied to the `outDir` directory. If you don't need to copy it, you can configure it as `false`.

### publicBaseDir

-   **Type**: `string`
-   **Default**: `true`

During the build, you can configure this property to control the path of the output static public resources. If not configured, `config.base` will be used to uniformly set the root address.

### worker (worker compilation extension information)

-   **Type**: `{ rollupOptions?: RollupOptions; plugins?: (input: string) => Promise<RollupPlugin> }`

You can use this property to implement custom extensions during worker compilation.
