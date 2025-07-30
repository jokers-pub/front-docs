## Development Server (server) Configuration

This section mainly introduces the configuration instructions for the `server` property in the configuration file. The type of this property is `ServerOptions`.

```js
module.exports = {
    server: {
        //...
    }
};
```

### port

-   **Type**: `number`
-   **Default**: `5858`

Specify the port for the development server. When you assign a port to the development server, note that if this port is already in use by another application, `Joker CLI` will **automatically search** for the next available port to start the service.

### host

-   **Type**: `string`
-   **Default**: `localhost`

Specify the IP address that the server listens on. If you set it to `0.0.0.0` or use the default value, the server will listen on all available network interfaces, which means it will accept connections from both the local area network and the public network.

You can also set this via the command-line interface (CLI) using the `--host` option. Using `--host 0.0.0.0` will bind the service to all network interfaces, while using `--host` without a parameter means using the server's default interface.

### https

-   **Type**: `boolean | http.HttpsServerOptions`

To enable TLS and HTTP/2, note that if the `server.proxy` option is also used, only the TLS protocol will be used.
You need a valid and available certificate to configure the server to use TLS.

### cors

-   **Type**: `boolean | CorsOptions`

You can configure Cross-Origin Resource Sharing (CORS) for the development server. By default, the CORS feature is enabled, and all origins are allowed. If you need to customize the behavior of CORS, you can pass an [options object](https://github.com/expressjs/cors#configuration-options) for adjustment. If you don't want to enable CORS, you can set this option to `false`.

### headers

-   **Type**: `OutgoingHttpHeaders`

You can specify the HTTP headers that should be included in the server's response.

### proxy

-   **Type**: `Record<string, string | ProxyOptions>`

You can set custom proxy rules for the development server by providing an object in the `{ key: options }` format. Any request path starting with the key name will be proxied to the corresponding target. If the key name starts with `^`, it will be treated as a regular expression. You can use the `configure` option to access the proxy instance.
Note that if you set a non-relative base path `base`, you must prefix each key name with this `base`.
In specific scenarios, you may also need to configure the underlying development server, such as adding custom middleware to the internal connect application. To do this, you need to write your own plugin and use the `configureServer` function to apply the changes.

Example:

```js
module.exports = {
    server: {
        proxy: {
            // Shorthand string notation: http://localhost:5173/foo -> http://localhost:4567/foo
            "/foo": "http://localhost:4567",
            // Notation with options: http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
            "/api": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "")
            },
            // Regular expression notation: http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
            "^/fallback/.*": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/fallback/, "")
            },
            // Using the proxy instance
            "/api": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                configure: (proxy, options) => {
                    // proxy is an instance of 'http-proxy'
                }
            },
            // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
            "/socket.io": {
                target: "ws://localhost:5174",
                ws: true
            }
        }
    }
};
```

### hmr

-   **Type**: `boolean | { port?: number; host?: string }`
-   **Default**: `true`

You can disable or customize the Hot Module Replacement (HMR) connection. If you need to use a different HTTP server address to handle the HMR WebSocket connection, you can make the corresponding configuration.

#### hmr.port

-   **Type**: `number`
-   **Default**: `25679`

The port for the HMR hot-update ws protocol. When you assign a port to the development server, note that if this port is already in use by another application, `Joker CLI` will **automatically search** for the next available port to start the service.

#### hmr.host

-   **Type**: `string`
-   **Default**: `localhost`

Specify the IP address that the `HMR server` listens on.

### fs

-   **Type**: `FileSystemServeOptions`

You can configure `fs` to specify the file indexing scope of Joker CLI.

```js
{
    strict: config.server?.fs?.strict ?? true,
    allow: config.server?.fs?.allow ?? []
}
```

#### fs.strict

-   **Type**: `boolean`
-   **Default**: `true`

Enable strict mode. Any file reference outside the `root` scope will be treated as an exception.

#### fs.allow

-   **Type**: `string[]`
-   **Default**: `[]`

You can specify which files can be served via the `/@fs/` path. When `server.fs.strict` is configured to `true`, only files in this directory list are allowed to be accessed. Any attempt to access files not in the list will return a 403 Forbidden error.
You can specify directories and files. Joker CLI will search for possible workspaces under this root directory and use them as the default workspaces. A valid workspace needs to meet several conditions. If these conditions are not met, Joker CLI will default to using the project root directory as an alternative.
