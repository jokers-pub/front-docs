## Building for Production

When deploying your application to a production environment, you can run the `joker build` command. By default, this command will use `<root>/index.html` as the build entry point and create an application bundle ready for static deployment.

### Browser Compatibility

Production builds assume the target browsers can natively support modern JavaScript features. The Joker CLI by default supports browsers capable of natively parsing [ESM script tags](https://caniuse.com/es6-module), [executing ESM dynamic imports](https://caniuse.com/es6-module-dynamic-import), and supporting [import.meta](https://caniuse.com/mdn-javascript_operators_import_meta):

- Chrome >=87 
- Firefox >=78
- Safari >=14  
- Edge >=88

You can specify target browser versions using the [build.target](/cli/setting-build) configuration, with minimum support down to ES2015.

Note that Joker CLI only handles syntax transformation by default and doesn't include any polyfills. For supporting legacy browsers, you can use [Polyfill.io](https://polyfill.io/), a service that automatically generates polyfill bundles based on the user's browser User-Agent.

For traditional browser compatibility scenarios, you can install and use the `@('@joker.front/cli-plugin-legacy')` plugin. This plugin automatically generates legacy-compatible builds with necessary polyfills that are loaded on-demand when the target browser lacks native ESM support.

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

The build process can be customized through various [build configuration options](/cli/setting-build). Specifically, you can directly adjust the underlying [Rollup](https://rollupjs.org/configuration-options/) options via [build.rollupOptions](/cli/setting-build):

```js
module.exports = {
    rollupOptions: {
        // https://rollupjs.org/configuration-options/
    }
};
```

### Public Base Path

When deploying your project to a nested public path, you can specify the base path using the [base](/cli/setting-public) configuration. This ensures all resource paths are rewritten accordingly. The option can also be set via CLI, e.g., `joker build --base=/my/public/path/`.

During build, resource URLs in JavaScript files, `url()` references in CSS, and resource references in HTML files are automatically adjusted to match the new base path, ensuring correct access post-deployment regardless of directory structure.

### Output Directory

To customize the build output location, configure the [build.outDir](/cli/setting-build) property or specify it via CLI:

```bash
joker build --outDir=./my-dist
```

By default, `build.outDir` is set to the `dist` directory if not specified.

### Chunking Strategy

Customize code splitting via [build.rollupOptions.output.manualChunks](/cli/setting-build). Refer to the [Rollup documentation](https://rollupjs.org/configuration-options/#output-manualchunks) for configuration details.

Joker CLI provides default chunking and path optimization:

- `node_modules` are bundled into **vendor** chunks.
- `import()` references generate chunks based on their paths rather than dumping everything into the root `dist` directory.

You can extend this logic, e.g., to isolate `dayjs` from vendor bundles:

```js
module.exports = {
    rollupOptions: {
        output: {
            manualChunks: (id, api) => {
                if (id.includes("node_modules/dayjs")) {
                    // Custom chunking
                    return "dayjs"; 
                }
            }
        }
    }
};
```

> When `manualChunks` is defined as a **function**, it does not override Joker CLI's default rules. Custom rules execute first; if they return no value, Joker's defaults apply. We recommend **against** using an object for `manualChunks` as it prevents safe merging with Joker's logic—always prefer functions to preserve async chunk paths and vendor splitting.

### Library Mode [lib]

When developing browser-oriented libraries, creating a test/demo page is often essential, and Joker CLI provides a smooth development experience via `index.html`.

For library publication builds, configure [build.lib](/cli/setting-build) to externalize dependencies that shouldn't be bundled, optimizing library size and performance.

```js
module.exports = {
    lib: {
        entry: resolve(__dirname, "lib/main.js"),
        name: "MyLib", 
        fileName: "my-lib"
    },
    rollupOptions: {
        // Ensure dependencies like echarts are externalized
        external: ["echarts"],
        output: {
            // Provide global variables for externalized dependencies in UMD builds
            globals: {
                echarts: "echarts" // Global variable name for echarts
            }
        }
    }
};
```