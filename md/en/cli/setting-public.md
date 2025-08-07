## Public Configuration

This section primarily introduces the configuration file specifications and instructions provided by Joker CLI.

### How to Use Configuration Files

In addition to configuring Joker CLI via command-line parameters (e.g., `--log`), you can also set execution parameters by creating dedicated configuration files. Using configuration files not only accommodates more complex functional requirements but also provides detailed configuration directives for `rollup`. This approach enhances flexibility and convenience, improving the overall user experience and efficiency.

You can create `.js` files as configuration files, which can be placed anywhere in your project—for example, `build/dev.config.js`. Additionally, you can create multiple configuration files for different environments, such as:

-   `dev.server.js`: Development server environment configuration  
-   `dev.build.js`: Development build environment configuration  
-   `prod.config.js`: Production build configuration  
-   `st.config.js`: Security Testing environment configuration  
-   And more  

You can define multiple execution commands in the `scripts` section of `package.json` and select different configuration files:

```json
{
    "scripts": {
        "dev": "joker --config=dev.config.js",
        "build": "joker build --config=build.config.js"
    }
}
```

You can specify different configuration files using the `config` property.

The configuration file adheres to the [CommonJS](https://wiki.commonjs.org/wiki/CommonJS) specification. You can export configuration information via `module.exports`.

```js
module.exports = {
    root: "./src"
};
```

Below, we will detail the properties available in the configuration file:

### root

-   Type: `string`  
-   Default: `process.cwd()`  

When the `root` parameter is specified, it defines the starting directory of the application. This directory can be either an absolute path or a relative path based on the current working directory (`process.cwd()`). The application will execute from this root directory, and all relative paths will be resolved based on it.

### base

-   Type: `string`  
-   Default: `/`  

In development or production environments, the service's public base path can accept the following valid values:

-   An absolute pathname, such as `/base/`, indicating the path starts from the root directory of the website.  
-   A full URL, such as `https://base.com/`. In development, the original URL segment is not used and serves only as a placeholder.  
-   An empty string or `./`, used for development environments with embedded services, representing the current directory.  

### mode

-   Type: `string`  
-   Default: `development`  

The `mode` parameter specifies the application's runtime mode, supporting `development` or `production`. These two modes correspond to the development and production environments, respectively. Once configured, the mode can be accessed and utilized via environment variables.

### command

-   Type: `string`  
-   Default: `server`  

**`command` cannot be manually configured**. It indicates the current command mode. During Joker CLI startup, the `command` value is automatically set. For example, `server` denotes starting the development service mode, while `build` represents the build mode.

### server

-   Type: `ServerOptions`  

> For detailed configurations, refer to the [Development Service](/cli/setting-server) documentation.  

### build

-   Type: `BuildOptions`  

> For detailed configurations, refer to the [Production Build](/cli/setting-build) documentation.  

### cacheDir

-   Type: `string`  
-   Default: `node_modules/.joker`  

Defines the cache directory where dependency caches and other files are stored. The default is `.joker` under the `node_modules` folder in the directory containing `package.json`. For more details, see [Dependency Pre-Building](/cli/dep).  

### publicDir

-   Type: `string | false`  
-   Default: `public`  

The static assets directory contains files that remain unchanged during development and builds. In development, these files are served from the root directory (`/`). In production builds, they are copied to the root of the `outDir`. The path can be either an absolute path or a relative path from the project root.  

Setting `publicDir` to `false` disables this feature.  

### logLeve

-   Type: `"silent" | "error" | "warn" | "info" | "debug"`  
-   Default: `info`  

The logging level, defaulting to `info`. To debug or understand Joker CLI's internal workings, set it to `debug`.  

### esbuild

-   Type: `boolean`  
-   Default: `true`  

By default, esbuild is used for compiling `.ts` files.  

To use a custom TypeScript compiler, disable esbuild by setting this to `false`.

### assetsInclude

-   Type: `string[]`  
-   Default: `See ASSET_TYPES below`  

By configuring additional asset types for processing, you can achieve:  

-   These resources will bypass the plugin transformation pipeline if referenced in HTML or requested via fetch/XHR.  
-   If imported in JavaScript, they resolve to a URL string unless transformed by an `enforce: 'pre'` plugin.  

Joker CLI already handles the following asset types by default:  

```ts
export const ASSET_TYPES: string[] = [
    // Images
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

    // Media
    "mp4",
    "webm",
    "ogg",
    "mp3",
    "wav",
    "flac",
    "aac",

    // Fonts
    "woff2?",
    "eot",
    "ttf",
    "otf",

    // Others
    "webmanifest",
    "pdf",
    "txt"
];
```

This property allows defining new extensions, which combine with the defaults.

### plugins

-   Type: `Plugin[] | Array<Plugin[]>`  

> Joker CLI plugins. For details, see [Creating Plugins](#cli/plugin-create).  

### resolve

-   Type: `ResolveOptions`  
-   Default: `{}`  

Configures the resolver by setting `mainFields` and `extensions`.  

#### resolve.mainFields

-   Type: `string[]`  
-   Default: `["browser", "module", "jsnext:main", "jsnext"]`  

Defines fields in `package.json` to resolve entry points. Note: `exports` field takes precedence.

#### resolve.extensions

-   Type: `string[]`  
-   Default: `[".js", "mjs", "mts", ".ts", ".json"]`  

Customize import extensions carefully to avoid breaking IDE/type support.  

### define

-   Type: `Record<string, any>`  
-   Default: `{}`  

Environment variable configuration. See [Variables & Modes](/cli/define).  

### css

-   Type: `CSSOptions`  
-   Default: `{}`  

CSS configuration. Extend compilation features via `preprocessorOptions` and `enableSourceMap`.  

#### css.preprocessorOptions

-   Type: `Record<string, any>`  
-   Default: `{}`  

Options passed to CSS preprocessors, keyed by file extension (e.g., Sass/Less).  

Example:
```json
{
    "sass": {
        "includePaths": ["node_modules"]
        // ...
    }
}
```

#### enableSourceMap

-   Type: `boolean`  
-   Default: `false`  

Whether to enable source maps.