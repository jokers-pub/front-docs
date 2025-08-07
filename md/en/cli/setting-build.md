## Production Build Configuration

This section introduces the configuration specifications for the `build` property in the configuration file, which is of type `BuildOptions`.

```js
module.exports = {
    build: {
        //...
    }
};
```

### write

- Type: `boolean`
- Default: `true`

Determines whether to output files. Default is `true`. Can be set to `false` for debugging or testing scenarios.

### target

- Type: `string | string[]`  
- Default: `["es2020", "edge88", "firefox78", "chrome87", "safari13"]`  

Specifies the target browser compatibility versions for the final build.  
**Note:** If your code contains features that esbuild cannot safely compile, the build process will fail. Refer to the [esbuild documentation](https://esbuild.github.io/content-types/#javascript) for more details.

### rollupOptions

- Type: `RollupOptions`  
- Default: `{}`  

Allows customization of the underlying Rollup bundling configuration. These options will be identical to those exported from a Rollup config file and will be merged with Joker CLI's internal Rollup options. For more information about Rollup options, see the [Rollup Configuration Options](https://rollupjs.org/configuration-options/).  

### outDir

- Type: `string`  
- Default: `dist`  

Specifies the output directory for generated files, relative to the project root directory.  

### sourcemap

- Type: `boolean`  
- Default: `false`  

Determines whether to generate source map files after the build. If set to `true`, a separate source map file will be generated. Joker CLI only supports generating standalone source map files (does not support `inline`, `hidden`, etc.).  

### assetsDir

- Type: `string`  
- Default: `assets`  

Specifies the directory for static assets (relative to `build.outDir`). **Not applicable in `library mode`.**  

To prevent Joker CLI from creating an assets directory, set this to an empty string (`''`).  

### assetsInlineLimit

- Type: `number`  
- Default: `4096` (4 KiB)  

Assets smaller than this threshold (in bytes) will be inlined as base64-encoded strings to minimize HTTP requests. Set to `0` to disable inlining.  

> **Note:** When `build.lib` is configured, `build.assetsInlineLimit` is ignored.  

### minify

- Type: `boolean | "esbuild" | "terser"`  
- Default: `true`  

When set to `true`, the `esbuild` minifier is used. If `false`, minification is disabled. Alternatively, a specific minifier can be chosen. By default, `esbuild` is ~20-40x faster than `terser` with only a 1%-2% difference in compression ratio.  

**Note:** In `lib` mode, if `esbuild` is used as the minifier, `build.minify` will **not** remove whitespace, as doing so could strip `pure` annotations and affect tree-shaking.  

To use `terser`, it must be installed first:  

```bash
pnpm add terser
```

### lib

- Type: `LibraryOptions | false`  
- Default: `false`  

Enables **library mode** when configured.  

The `LibraryOptions` type is defined as:  

```ts
export interface LibraryOptions {
    /**
     * Entry file  
     */
    entry: string;  
    /**
     * Alias name  
     */
    name?: string;  
    /**
     * Output formats  
     * @default [es, umd]  
     */
    formats?: LibraryFormatType[];  

    /**
     * Output file name (defaults to original filename if not specified)  
     */
    fileName?: string | ((format: ModuleFormat) => string);  
}  

export type LibraryFormatType = "es" | "cjs" | "umd" | "iife";  
```

### chunkSizeWarningLimit  

- Type: `number`  
- Default: `500`  

Sets a warning threshold (in kB) for uncompressed chunk sizes. JavaScript chunk size correlates with execution time, so this helps identify potentially oversized chunks requiring optimization.  

### cssTarget  

- Type: `string | string[]`  
- Default: `["es2020", "edge88", "firefox78", "chrome87", "safari13"]`  

Allows specifying a separate browser target for CSS minification, distinct from JavaScript transpilation.  

Use primarily for non-mainstream or legacy browsers. Example: Android WeChat WebView supports modern JS but not RGBA hex colors in CSS. Setting `build.cssTarget` to `chrome61` prevents Joker CLI from converting RGBA to `#RGBA` hex notation.  

### copyPublicDir  

- Type: `boolean`  
- Default: `true`  

By default, the `publicDir` folder is copied to `outDir` after building. Set to **false** to disable this behavior.  

### publicBaseDir  

- Type: `string`  
- Default: `true`  

Controls the base path for static public assets in the build output. If unset, defaults to `config.base`.  

### Worker Compilation Extensions  

- Type: `{ rollupOptions?: RollupOptions; plugins?: (input: string) => Promise<RollupPlugin> }`  

Enables custom extensions for worker compilation.