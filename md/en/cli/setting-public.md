## Common Configuration

This section mainly introduces the specification and instructions of the configuration file provided by Joker CLI.

### How to Use the Configuration File

In addition to using Joker CLI's command-line parameters (e.g., `--log`) for configuration, you can also set the execution parameters of Joker CLI by creating a dedicated configuration file. Using a configuration file not only meets more complex functional requirements but also provides detailed configuration instructions for `rollup`. This method improves the flexibility and convenience of configuration and helps enhance the usage experience and efficiency.

We can create a `js` file as the configuration file. The configuration file can be placed anywhere in the project, for example, `build/dev.config.js`. You can also create multiple configuration files, such as:

-   `dev.server.js`: Configuration for the development server environment.
-   `dev.build.js`: Configuration for the development build environment.
-   `prod.config.js`: Configuration for the production build.
-   `st.config.js`: Configuration for the security testing environment.
-   And so on.

We can create multiple execution commands in the `script` section of `package.json` and select different configuration files:

```json
{
    "scripts": {
        "dev": "joker --config=dev.config.js",
        "build": "joker build --config=build.config.js"
    }
}
```

We can use the `config` property to specify different configuration files.

The configuration file follows the [CommonJS](https://wiki.commonjs.org/wiki/CommonJS) specification. We can export our configuration information via `module.exports`.

```js
module.exports = {
    root: "./src"
};
```

Next, we will introduce the property configurations in the configuration file:

### root

-   **Type**: `string`
-   **Default**: `process.cwd()`

When the `root` parameter is specified, it defines the starting directory of the application. This directory can be an absolute path or a relative path relative to the current working directory `process.cwd()`. The application will start executing from this specified root directory, and all paths relative to this directory will be resolved based on it.

### base

-   **Type**: `string`
-   **Default**: `/`

In the development or production environment, the following legal values can be used for the service public base path:

-   An absolute path name, such as `/base/`, which means the path starts from the root directory of the website.
-   A complete URL, for example, `https://base.com/`. In the development environment, the original URL part will not be used and only serves as a placeholder.
-   An empty string or `./`, which is used for embedded services in the development environment, indicating the current directory.

### mode

-   **Type**: `string`
-   **Default**: `development`

The `mode` parameter is used to specify the running mode of the application and supports being set to `development` or `production`. These two modes correspond to the development environment and the production environment respectively. After the mode is configured, it can be accessed and utilized through environment variables.

### command

-   **Type**: `string`
-   **Default**: `server`

The `command` **cannot** be configured. It is used to indicate the current command mode. During the startup process of Joker CLI, the value of `command` will be automatically set. For example, `server` indicates starting the development service mode, while `build` represents executing the build mode.

### server

-   **Type**: `ServerOptions`

> For detailed configuration, please refer to the [Development Service](/cli/setting-server) configuration instructions.

### build

-   **Type**: `BuildOptions`

> For detailed configuration, please refer to the [Production Build](/cli/setting-build) configuration instructions.

### cacheDir

-   **Type**: `string`
-   **Default**: `node_modules/.joker`

Define the cache directory, which stores files such as dep dependency caches. The default is `node_modules/.joker` under the folder where `package.json` is located. For more details, please refer to [Dependency Pre-building](/cli/dep).

### publicDir

-   **Type**: `string|false`
-   **Default**: `public`

The static resource service folder is used to store resource files that do not need to change during the development and build processes. During the development phase, these files are located at the root directory `/` of the project for direct access. During the build phase, these files will be copied to the root directory of the specified `outDir` and provided to users as they are without any conversion. This path can be an absolute path in the file system or a relative path relative to the project root directory.

If `publicDir` is set to `false`, this function will be disabled.

### logLeve

-   **Type**: `"silent" | "error" | "warn" | "info" | "debug"`
-   **Default**: `info`

The log output level. The default is `info`. If you want to understand the running mechanism of Joker CLI or need to debug Joker CLI, you can configure it to `debug`.

### esbuild

-   **Type**: `boolean`
-   **Default**: `true`

By default, esbuild will be applied in the compilation process of `ts` files.

When you need custom `ts` compilation, you can configure it to `false` to disable the `esbuild` function.

### assetsInclude

-   **Type**: `string[]`
-   **Default**: `Refer to the following ASSET_TYPES content`

By configuring additional resource types to be processed, we can achieve the following:

-   When these resources are referenced through HTML or requested via fetch or XHR, they will not be processed by the plugin's transformation pipeline.
-   If you try to import these resources from JavaScript, you will get a resolved URL string as the result. However, if you use a `enforce: 'pre'` plugin to handle different types of assets, this behavior may change. You can view the built-in resource type list for more information.

Joker CLI already treats the following types as resource types by default:

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

In this property, you can define new extension types. Joker CLI will combine these custom extensions with the default extensions to form the resource extension values.

### plugins

-   **Type**: `Plugin[] | Array<Plugin[]>`

> Joker CLI plugins. For more details, please refer to [Creating Plugins](#cli/plugin-create).

### resolve

-   **Type**: `ResolveOptions`
-   **Default**: `{}`

This property is used to configure the resolver. We can perform resolution configuration by setting the internal `mainFields` and `extensions` properties.

#### resolve.mainFields

-   **Type**: `string[]`
-   **Default**: `["browser","module", "jsnext:main", "jsnext"]`

In `package.json`, `resolve.mainFields` defines the list of fields to try when resolving the entry point of a package. Note that the priority of this list is lower than that of resolving the entry point from the `exports` field: if the entry point is successfully found through the `exports` field, `resolve.mainFields` will not be considered.

#### resolve.extensions

-   **Type**: `string[]`
-   **Default**: `[".js", "mjs", "mts", ".ts", ".json"]`

Be cautious when omitting specific extensions during import, especially for extensions of custom import types. Avoid doing so to prevent affecting the normal functionality of the IDE and type support.

### define

-   **Type**: `Record<string, any>`
-   **Default**: `{}`

Environment variable configuration. For more details, please refer to [Variables and Modes](/cli/define).

### css

-   **Type**: `CSSOptions`
-   **Default**: `{}`

CSS configuration. You can extend the CSS compilation function by configuring `preprocessorOptions` and `enableSourceMap`.

#### css.preprocessorOptions

-   **Type**: `Record<string, any>`
-   **Default**: `{}`

When specifying options to be passed to the CSS pre-processor, the file extension will be used as the key for the options. For the specific options supported by each pre-processor, you can find the information in the corresponding official documentation:

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

-   **Type**: `boolean`
-   **Default**: `false`

Whether to enable sourcemap.
