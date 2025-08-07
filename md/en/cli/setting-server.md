## Server Configuration

This section details the configuration options for the `server` property in the configuration file, which is of type `ServerOptions`.

```js
module.exports = {
    server: {
        //...
    }
};
```

### port

-   Type: `number`
-   Default: `5858`

Specifies the port for the development server. When assigning a port to the development server, note that if the port is already in use by another application, `Joker CLI` will **automatically search** for the next available port to start the service.

### host

-   Type: `string`
-   Default: `localhost`

Specifies the IP address the server will listen on. If set to `0.0.0.0` or the default value, the server will listen on all available network interfaces, meaning it will accept connections from both local networks and the public internet.

You can also set this via the Command Line Interface (CLI) using the `--host` option. Using `--host 0.0.0.0` binds the service to all network interfaces, while specifying no argument after `--host` will use the server's default interface.

### https

-   Type: `boolean | http.HttpsServerOptions`

To enable TLS and HTTP/2, note that if the `server.proxy` option is also used, only the TLS protocol will be employed. A valid and functioning certificate is required to configure the server with TLS.

### cors

-   Type: `boolean | CorsOptions`

Configure Cross-Origin Resource Sharing (CORS) for the development server. By default, CORS is enabled and allows all origins. If you need to customize CORS behavior, you can pass an [options object](https://github.com/expressjs/cors#configuration-options). To disable CORS, set this option to `false`.

### headers

-   Type: `OutgoingHttpHeaders`

Specifies the HTTP headers to include in server responses.

### proxy

-   Type: `Record<string, string | ProxyOptions>`

Configure custom proxy rules for the development server by providing an object in the `{ key: options }` format. Any request path starting with the key will be proxied to the corresponding target. If the key starts with `^`, it will be treated as a regular expression. Use the `configure` option to access the proxy instance.  

Note: If a non-relative base path `base` is set, it must be prefixed to each key.  

For specific scenarios, you may need to configure the underlying development server, such as adding custom middleware to the internal connect app. To do this, write your own plugin and use the `configureServer` function to apply changes.

Example:

```js
module.exports = {
    server: {
        proxy: {
            // String shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
            "/foo": "http://localhost:4567",
            // With options: http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
            "/api": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "")
            },
            // Regex example: http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
            "^/fallback/.*": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/fallback/, "")
            },
            // Using proxy instance
            "/api": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                configure: (proxy, options) => {
                    // proxy is 'http-proxy' instance
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

-   Type: `boolean | { port?: number; host?: string }`
-   Default: `true`

Disable or customize the Hot Module Replacement (HMR) connection. If a different HTTP server address is needed for the HMR WebSocket connection, configure it accordingly.

#### hmr.port

-   Type: `number`
-   Default: `25679`

Specifies the WebSocket protocol port for HMR. If the port is already in use, `Joker CLI` will **automatically search** for the next available port.

#### hmr.host

-   Type: `string`
-   Default: `localhost`

Specifies the IP address that the `HMR server` will listen on.

### fs

-   Type: `FileSystemServeOptions`

Configure `fs` to specify the file indexing scope for Joker CLI.

```js
{
    strict: config.server?.fs?.strict ?? true,
    allow: config.server?.fs?.allow ?? []
}
```

#### fs.strict

-   Type: `boolean`
-   Default: `true`

Enables strict mode. Any file reference outside the `root` scope will be treated as an exception.

#### fs.allow

-   Type: `string[]`
-   Default: `[]`

Specifies which files can be served via the `/@fs/` path. When `server.fs.strict` is set to `true`, only files within this directory list are accessible. Any attempt to access files outside this list will result in a 403 Forbidden error.  

You can specify directories and files. Joker CLI will search for potential workspaces under this root directory and use them as the default workspace. A valid workspace must meet specific conditions; otherwise, Joker CLI will fall back to using the project root directory.