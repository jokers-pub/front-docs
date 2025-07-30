## Creating Plugins

Joker CLI plugins are built on top of the excellent Rollup plugin architecture and introduce unique configuration options specifically designed for Joker CLI. This means that once a Joker CLI plugin is written, it can work seamlessly in both development and production environments without additional configuration.

Before reading this section, please first learn about [Rollup plugins](https://rollupjs.org/plugin-development/#plugins-overview). This section mainly introduces some of the Joker CLI's own properties.

### Naming

We recommend that all Joker CLI plugins be named with the prefix `@('@joker.front/cli-')` to ensure that developers can quickly identify the type of the library by its name when referencing it.

### A Simple Example

```js
const fileRegex = /\.(my-file-ext)$/;

export default function myPlugin() {
    return {
        name: "transform-file",

        transform(src, id) {
            if (fileRegex.test(id)) {
                return {
                    code: compileFileToJS(src),
                    map: null // Provide source map if possible
                };
            }
        }
    };
}
```

### enforce

-   **Type**: `"pre" | "post"`

This can be used to specify the execution order of the plugin.

-   `pre`: Ensures that the plugin is executed before the core plugins of Joker CLI.
-   `default`: The plugin will be executed in sequence after the core plugins of Joker CLI.
-   `post`: The plugin will be executed after the completion of the Joker CLI build process.

### apply

-   **Type**: `"build" | "server"`

This is used to specify in which environments the plugin takes effect. When not set by default, it means the plugin will be executed in all modes.

### configureServer

-   **Type**: `(server: Server) => void | Promise<void>`

This is a hook for configuring the development server. We can use this hook to implement the storage of the `server` object and other configurations.

```js
const myPlugin = () => ({
    name: "configure-server",
    configureServer(server) {
        // Return a post-hook that is called after the internal middleware is installed
        return () => {
            server.middlewares.use((req, res, next) => {
                // Custom request handling...
            });
        };
    }
});

const myPlugin = () => {
    let server;
    return {
        name: "configure-server",
        configureServer(_server) {
            server = _server;
        },
        transform(code, id) {
            if (server) {
                // Use server...
            }
        }
    };
};
```

### configTransform

-   **Type**: `(config: ResolvedConfig) => Promise<void> | void`

Through this hook, some configurations can be made to the `config`. We can set default values for a certain property within this method, or we can process the incoming `config` for the second time.

### indexHtmlTransform

This property is used to extend the transformation of `html`. Its configuration rules are as follows:

```ts
export type IndexHtmlTransformHook = (
    content: string,
    option: IndexHtmlTransformOption
) => IndexHtmlTransformResult | void | Promise<IndexHtmlTransformResult | void>;

export type IndexHtmlTransform =
    | IndexHtmlTransformHook
    | {
          enforce?: Plugin["enforce"];
          transform: IndexHtmlTransformHook;
      };
```

This feature allows for asynchronous operations and can return one of the following forms:

-   The transformed HTML string.
-   An array of property objects describing tags to be injected into the existing HTML, where each tag can also define its insertion position (by default, before the <head> tag).
-   An object containing `{ html, tags }`.

For example: Convert the title to a specified value

```js
const htmlPlugin = () => {
    return {
        name: "html-transform",
        transformIndexHtml(html) {
            return html.replace(/<title>(.*?)<\/title>/, `<title>Title replaced!</title>`);
        }
    };
};
```

### hmrUpdate

This is the hook function for handling HMR (Hot Module Replacement) hot updates. This function only takes effect in the `server` mode.

```ts
    /**
     * The context for hot-updated module Update.
     * We can implement the update of properties such as modules through this hook.
     * @param ctx
     */
    hmrUpdate?(ctx: HMRContext, server: Server): ModuleNode[] | void | Promise<ModuleNode[] | void>;
```

We can configure this function to listen for and customize the handling of hot updates.

```ts
    hmrUpdate(ctx, server) {
        if (filter(ctx.file) === false) {
            return;
        }

        return hotUpdate(config, ctx, server);
    },
```
