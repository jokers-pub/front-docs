## Dependency Pre-Bundling

The Joker CLI scans and identifies dependencies in the `node_modules` directory during project initialization, compiling these packages ahead of time in a silent asynchronous manner.

### Purpose

The rationale behind Joker CLI's dependency pre-bundling includes:

- **`CommonJS or UMD`**: The Joker CLI development server treats all code as native **ES** modules during runtime. This necessitates intelligent conversion of `CommonJS or UMD`-formatted dependencies to be compatible as **ES** modules. When handling `CommonJS` modules, Joker CLI employs sophisticated import analysis to ensure seamless compatibility with named imports, even for dynamically exported modules, thereby guaranteeing a smooth development experience.

- **`Performance`**: To enhance page loading speed, Joker CLI adopts an optimization strategy by consolidating ESM dependencies with numerous internal modules into a single module. This approach significantly reduces the number of module requests, thereby accelerating page load times.

  For example, take the `lodash-es` library, which contains over 600 individual modules. In a traditional ES module import scenario, importing the `debounce` function would trigger the browser to initiate more than 600 separate HTTP requests. While the server might easily handle these requests, the sheer volume of network traffic would congest the browser-side network, adversely affecting page load performance.  
  However, with Joker CLI's pre-bundling feature, `lodash-es` is consolidated into a single module. This means only one HTTP request is needed to load the entire library, drastically reducing network latency and improving the user experience.

### Cache

Joker CLI stores pre-bundled files in `node_modules/.joker/deps`. These files are categorized into `server` and `build_dist` directories based on the command executed, corresponding to development server cache and build-time cache, respectively.

![DEP_CACHE](/cli/dep_cache.png)

The `_manifest.json` file records all cache information and versions:

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

> If you need to force Joker CLI to rebuild dependencies for any reason, you can manually delete the `node_modules/.joker` cache directory.