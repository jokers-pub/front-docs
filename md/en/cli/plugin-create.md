## Creating Plugins

Joker CLI plugins are built on top of the excellent Rollup plugin architecture and introduce unique configuration options specifically designed for Joker CLI. This means once a Joker CLI plugin is written, it can work seamlessly in both development and production environments without requiring additional configuration.

Before reading this section, please first familiarize yourself with [Rollup plugin](https://rollupjs.org/plugin-development/#plugins-overview) concepts. This section primarily introduces Joker CLI's proprietary properties.

### Naming

We recommend that all Joker CLI plugins be prefixed with `@('@joker.front/cli-')` in their names. This ensures developers can quickly identify the library type by its name when referencing it.

### Simple Example

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

-   Type: `"pre" | "post"`

Specifies the execution order of the plugin.

-   `pre`: Ensures the plugin executes before Joker CLI core plugins.
-   `default`: The plugin will execute in sequence after Joker CLI core plugins.
-   `post`: The plugin will execute after Joker CLI build process is completed.

### apply

-   Type: `"build" | "server"`

Specifies the environments in which the plugin is effective. When not set, it means the plugin executes in all modes.

### configureServer

-   Type: `(server: Server) => void | Promise<void>`

A hook used to configure the development server. You can use this HOOK to store the `server` object and perform other configurations.

```js
const myPlugin = () => ({
    name: "configure-server",
    configureServer(server) {
        // Returns a post hook that is called 
        // after internal middleware is installed
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
                // Use the server...
            }
        }
    };
};
```

### configTransform

-   Type: `(config: ResolvedConfig) => Promise<void> | void`

This HOOK allows you to configure the `config`. You can set default values for properties within this function or perform secondary processing on the incoming `config`.

### indexHtmlTransform

This property is used to extend HTML transformations. Its configuration rules are:

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

This feature allows asynchronous operations and can return one of the following:

-   The transformed HTML string.
-   An array of attribute objects describing tags to inject into the existing HTML, with each tag optionally specifying its insertion position (default is before the `<head>` tag).
-   An object containing `{ html, tags }`.

For example, replacing the title with a specified value:

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

HMR (Hot Module Replacement) update processing hook function. This function only takes effect in `server` mode.

```ts
    /**
     * HMR update context
     * Allows updating properties like modules via this hook
     * @param ctx
     */
    hmrUpdate?(ctx: HMRContext, server: Server): ModuleNode[] | void | Promise<ModuleNode[] | void>;
```

You can configure this function to listen and customize hot updates.

```ts
    hmrUpdate(ctx, server) {
        if (filter(ctx.file) === false) {
            return;
        }

        return hotUpdate(config, ctx, server);
    },
```