## Building for Production

When deploying your application to the production environment, you can run the `joker build` command. By default, this command uses `<root>/index.html` as the starting point for the build and creates an application package suitable for static deployment.

### Browser Compatibility

The production-ready build assumes that the target browsers are compatible with the latest JavaScript language features. By default, Joker CLI supports browsers that can natively parse [ESM script tags](https://caniuse.com/es6-module), [execute ESM dynamic imports](https://caniuse.com/es6-module-dynamic-import), and support [import.meta](https://caniuse.com/mdn-javascript_operators_import_meta):

-   Chrome >=87
-   Firefox >=78
-   Safari >=14
-   Edge >=88

You can use the [build.target](/cli/setting-build) configuration option to specify the target browser version for the build, with a minimum support down to the ES2015 standard.

It should be noted that by default, Joker CLI only handles syntax transformation and does not include any polyfills. If you need to provide support for older browsers, you can visit [Polyfill.io](https://polyfill.io/), a service that can automatically generate polyfill packages based on the user's browser User-Agent.

For scenarios that require compatibility with traditional browsers, you can support them by installing and using the plugin `@('@joker.front/cli-plugin-legacy')`. This plugin will automatically generate versions suitable for older browsers and the necessary polyfills to ensure correct operation on these browsers. These compatibility-version chunks will only be loaded on-demand when the target browser does not support native ESM.

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

### Customizing the Build

The build process can be customized through various build configuration options. Specifically, you can directly adjust the underlying [Rollup](https://rollupjs.org/configuration-options/) options via [build.rollupOptions](/cli/setting-build):

```js
module.exports = {
    rollupOptions: {
        // https://rollupjs.org/configuration-options/
    }
};
```

### Public Base Path

When you need to deploy your project to a public path with a nested structure, you can specify the base path by setting the [base](/cli/setting-public) configuration option. All resource paths will be rewritten accordingly based on this configuration. Additionally, you can also set this option via command-line arguments, for example, using `joker build --base=/my/public/path/`.

During the build process, the resource URLs imported in JavaScript files, the `url()` references used in CSS files, and the resources referenced in HTML files will be automatically adjusted to adapt to the new base-path configuration. This automated path transformation ensures that resources can be accessed correctly after deployment, regardless of the directory in which they are placed within the project.

### Production Directory

To customize the storage location of the built artifacts, you can specify the output directory by setting the [build.outDir](/cli/setting-build) property. You can also specify `outDir` via CLI command-line arguments.

```bash
joker build --outDir=./my-dist
```

By default, if not specified otherwise, `build.outDir` is set to the `dist` directory.

### Artifact Chunking Strategy

You can utilize the [build.rollupOptions.output.manualChunks](/cli/setting-build) configuration option to customize the code-splitting strategy. Refer to the [Rollup](https://rollupjs.org/configuration-options/#output-manualchunks) documentation for details on how to set it.

Joker CLI provides a basic set of splitting logic and artifact path optimization features by default:

-   `node_module` will be merged into **vendor**.
-   For `import()` references, we will generate artifacts according to the reference path instead of outputting all to the root of the `dist` directory.

Of course, you can extend your own logic on top of the splitting rules provided by Joker CLI. For example, if we want to prevent `dayjs` from being merged into **vendor** and handle it as a separate package:

```js
module.exports = {
    rollupOptions: {
        output: {
            manualChunks: (id, api) => {
                if (id.includes("node_modules/dayjs")) {
                    // Customize
                    return "dayjs";
                }
            }
        }
    }
};
```

> When the `manualChunks` property is defined as a **function**, it will not override the default rules provided by Joker CLI. We will first execute according to the custom rules passed in. If the method does not return a value, it will be executed according to the rules provided by Joker CLI. We do not recommend setting the `manualChunks` property to an **object** because Joker CLI cannot safely perform a merge transformation. It is recommended to use a Function to configure this property, which can retain the asynchronous file-path output of `import()` and the splitting logic of the `vendor` package provided by Joker.

### Building a Library [lib Library Mode]

When developing a browser-facing library, creating a test/demo page is usually a crucial task, and Joker CLI enables you to enjoy a smooth development experience by using the `index.html` file.

When preparing a release build of your library, you should configure the [build.lib](/cli/setting-build) option to ensure that dependencies that do not need to be packaged into the library are externalized, which can optimize the size and performance of the library.

```js
module.exports = {
    lib: {
        entry: resolve(__dirname, "lib/main.js"),
        name: "MyLib",
        fileName: "my-lib"
    },
    rollupOptions: {
        // Ensure that dependencies you don't want to include in the library are externalized
        external: ["echarts"],
        output: {
            // Provide a global variable for these externalized dependencies in the UMD build mode
            globals: {
                echarts: "echarts" // Set the global variable name for echarts
            }
        }
    }
};
```
