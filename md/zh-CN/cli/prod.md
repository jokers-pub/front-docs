## 构建生产版本

在部署应用到生产环境时，您可以运行 `joker build` 命令。这个命令会默认以 `<root>/index.html` 作为构建的起点，并创建一个适合静态部署的应用程序包。

### 浏览器兼容性

部署到生产环境的构建版本假设目标浏览器能够兼容最新的 JavaScript 语言特性。Joker CLI 默认支持那些能够原生解析[ESM 脚本标签](https://caniuse.com/es6-module)、[执行 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import)以及支持[import.meta](https://caniuse.com/mdn-javascript_operators_import_meta)的浏览器：

- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

您可以使用 [build.target](/cli/setting-build) 配置项来指定构建的目标浏览器版本，最低支持到 ES2015 标准。

需要注意的是，Joker CLI 在默认情况下仅处理语法转换，不包含任何 polyfill。如果您需要为老旧浏览器提供支持，可以访问[Polyfill.io](https://polyfill.io/)，这是一个可以根据用户浏览器的 User-Agent 自动生成 polyfill 包的服务。

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

### 自定义构建

构建过程可以通过多种 构建配置选项 来自定义构建。具体来说，你可以通过 [build.rollupOptions](/cli/setting-build) 直接调整底层的 [Rollup](https://rollupjs.org/configuration-options/) 选项：

```js
module.exports = {
    rollupOptions: {
        // https://rollupjs.org/configuration-options/
    }
};
```

### 公共基础路径

当你需要将项目部署到具有嵌套结构的公共路径下时，可以通过设置 [base](/cli/setting-public) 配置项来指定基础路径。这样，所有资源的路径都会根据这个配置进行相应的重写。此外，你也可以通过命令行参数来设置这个选项，例如使用 `joker build --base=/my/public/path/`。

在构建过程中，JavaScript 文件中引入的资源 URL、CSS 文件中使用的 `url()` 引用以及 HTML 文件中引用的资源都会被自动调整，以适应新的基础路径配置。这种自动化的路径转换确保了资源能够在部署后正确地被访问，无论它们被放置在项目的哪个目录下。

### 生产目录

为了定制构建后产物的存储位置，你可以通过设置 [build.outDir](/cli/setting-build) 属性来指定输出目录。此外，你也可以通过 CLI 命令行参数来指定 `outDir`。

```bash
joker build --outDir=./my-dist
```

默认情况下，如果不特别指定，`build.outDir` 会被设置为 `dist` 目录。

### 产物分块策略

您可以利用 [build.rollupOptions.output.manualChunks](/cli/setting-build) 配置项来自定义代码分割策略。具体细节请参考[Rollup](https://rollupjs.org/configuration-options/#output-manualchunks)文档以了解如何设置。

Joker CLI 默认提供了一套基础的拆分逻辑以及产物路径优化功能：

- `node_module` 会合并成为**vendor**。
- 针对`import()`引用我们将按照引用路径去生成产物，而非全部输出到 dist 根目录。

当然你可以在 Joker CLI 提供的拆分规则之上扩展自己的逻辑，例如：我们想把`dayjs`不合并到**vendor**，将它作为单独的包处理：

```js
module.exports = {
    rollupOptions: {
        output: {
            manualChunks: (id, api) => {
                if (id.includes("node_modules/dayjs")) {
                    //自定义
                    return "dayjs";
                }
            }
        }
    }
};
```

> 当 `manualChunks` 属性定义为**function**时，并不会覆盖 Joker CLI 提供的默认规则，我们将先按照传入的自定义规则执行，若该方法未返回值，则按照 Joker CLI 提供的规则执行，我们不建议将`manualChunks`属性设置为**对象**，因为 Joker CLI 无法安全的进行融合转换，建议使用 Function 去配置该属性，这样可以保留 Joker 提供的 import()异步文件路径输出以及 vendor 包拆分等逻辑。

### 构建库 [lib 库模式]

在开发面向浏览器的库时，创建一个测试/演示页面通常是至关重要的工作，而 Joker CLI 能够让你通过使用`index.html`文件，享受到流畅的开发体验。

在准备发布构建你的库时，应配置[build.lib](/cli/setting-build)选项，以确保将那些不需要打包进库的依赖项外部化，这样做可以优化库的大小和性能。

```js
module.exports = {
    lib: {
        entry: resolve(__dirname, "lib/main.js"),
        name: "MyLib",
        fileName: "my-lib"
    },
    rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ["echarts"],
        output: {
            // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
            globals: {
                echarts: "echarts" // 为 echarts 设置全局变量名称
            }
        }
    }
};
```
