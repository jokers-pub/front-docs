## 依赖预构建

Joker CLI 在项目启动时会扫描识别项目中`node_modules`中的依赖，并使用异步的方式去提前静默编译这些包。

### 目的

Joker CLI 之所以要采用依赖预构建是因为：

-   `CommonJS 或 UMD`： Joker CLI 的开发服务器在运行时将所有代码视为原生的 **ES** 模块，这就要求它对 `CommonJS 或 UMD` 格式的依赖项进行智能转换，以便能够作为 **ES** 模块使用。Joker CLI 在转换 `CommonJS` 模块时，采用精细的导入分析技术，确保即使在动态导出的情况下，通过具名导入（named imports）也能无缝兼容，从而保障了开发过程中的平滑体验。

-   `性能`： 为了提升页面加载速度，Joker CLI 采取了一种优化策略，将那些包含大量内部模块的 ESM 依赖项整合成单个模块。这种做法可以显著减少模块请求的数量，从而加快页面加载速度。

    以 `lodash-es` 为例，这个库包含超过 600 个独立的模块。在传统的 ES 模块导入方式下，如果我们导入 debounce 函数，浏览器将不得不发起 600 多个独立的 HTTP 请求。尽管服务器可能能够轻松处理这些请求，但大量的网络请求会导致浏览器端的网络拥堵，进而影响页面的加载速度。
    然而，通过 Joker CLI 的预构建功能，`lodash-es` 能够被整合成一个单一的模块。这样一来，我们只需要发起一个 HTTP 请求即可加载整个库，极大地减少了网络延迟，提升了用户体验。

### 缓存

Joker CLI 会将预编译后的文件存放在`node_modules/.joker/deps`中。该文件会根据运行命令分为`server`和`build_dist`两个目录分别对应开发态服务缓存和构建时缓存。

![DEP_CACHE](/cli/dep_cache.png)

其中`_manifest.json`文件用于记录所有缓存的信息及版本。

```json
{
    "hash": "16dc7a8d",
    "browserHash": "9e7cbf30",
    "resolved": {
        "@joker.front/core": {
            "src": "../../../.pnpm/@joker.front+core@1.2.137/node_modules/@joker.front/core/dist/bundle.es.js",
            "file": "../server/@joker__front_core.js",
            "fileHash": "a2ebc2fa",
            "needRewriteImport": false
        },
        "@joker.front/router": {
            "src": "../../../.pnpm/@joker.front+router@1.0.21_@joker.front+core@1.2.137/node_modules/@joker.front/router/dist/bundle.es.js",
            "file": "../server/@joker__front_router.js",
            "fileHash": "1f59a9bd",
            "needRewriteImport": false
        },
        "@joker.front/ui": {
            "src": "../../../.pnpm/@joker.front+ui@1.0.13/node_modules/@joker.front/ui/dist/index.mjs",
            "file": "../server/@joker__front_ui.js",
            "fileHash": "7a1cab3e",
            "needRewriteImport": false
        },
        "highlight.js/lib/common": {
            "src": "../../../.pnpm/highlight.js@11.9.0/node_modules/highlight.js/es/common.js",
            "file": "../server/highlight__js_lib_common.js",
            "fileHash": "4a885f0e",
            "needRewriteImport": false
        }
    },
    "chunks": {
        "chunk-AAW4LQHI": {
            "file": "../server/chunk-AAW4LQHI.js"
        },
        "chunk-DSTXS4JB": {
            "file": "../server/chunk-DSTXS4JB.js"
        }
    }
}
```

> 如果出于某些原因你想要强制 Joker CLI 重新构建依赖项，你可以手动删除 node_modules/.joker 缓存目录。
