## Dependency Pre-building

Joker CLI scans and identifies the dependencies in `node_modules` of the project when the project starts, and uses an asynchronous method to silently compile these packages in advance.

### Purpose

The reasons why Joker CLI adopts dependency pre-building are as follows:

-   **CommonJS or UMD**: The development server of Joker CLI treats all code as native **ES** modules during runtime. This requires it to intelligently convert dependencies in `CommonJS` or `UMD` formats so that they can be used as **ES** modules. When converting `CommonJS` modules, Joker CLI uses a sophisticated import analysis technique to ensure that even in the case of dynamic exports, named imports can be seamlessly compatible, thus guaranteeing a smooth experience during development.

-   **Performance**: To improve the page loading speed, Joker CLI adopts an optimization strategy of integrating ESM dependencies containing a large number of internal modules into a single module. This approach can significantly reduce the number of module requests, thereby accelerating the page loading speed.

    Take `lodash-es` as an example. This library contains more than 600 independent modules. In the traditional ES module import method, if we import the `debounce` function, the browser will have to initiate more than 600 independent HTTP requests. Although the server may be able to handle these requests easily, a large number of network requests will cause network congestion on the browser side, which in turn affects the page loading speed.
    However, through the pre-building function of Joker CLI, `lodash-es` can be integrated into a single module. In this way, we only need to initiate one HTTP request to load the entire library, greatly reducing network latency and improving the user experience.

### Cache

Joker CLI stores the pre-compiled files in `node_modules/.joker/deps`. This file is divided into two directories, `server` and `build_dist`, according to the running command, corresponding to the development-state service cache and the build-time cache respectively.

![DEP_CACHE](/cli/dep_cache.png)

The `_manifest.json` file is used to record the information and versions of all caches.

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

> If for some reason you want to force Joker CLI to rebuild the dependencies, you can manually delete the `node_modules/.joker` cache directory.
