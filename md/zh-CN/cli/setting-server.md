## 开发服务(server)配置

该章节主要介绍配置文件中`server`属性的配置说明，该属性类型为`ServerOptions`。

```js
module.exports = {
    server: {
        //...
    }
};
```

### port

-   类型：`number`
-   默认：`5858`

指定开发服务器端口。当你指定一个端口给开发服务器时，请注意，如果这个端口已经被其他应用程序使用，`Joker CLI` 将会 **自动寻找** 下一个可用的端口来启动服务。

### host

-   类型：`string`
-   默认：`localhost`

指定服务器监听的 IP 地址。如果将此设置为 0.0.0.0 或者使用默认值，服务器将监听所有可用的网络接口，这意味着它将同时接收来自局域网和公网的连接。

您还可以通过命令行界面（CLI）使用`--host`选项来设置，其中使用`--host 0.0.0.0`将服务绑定到所有网络接口，而`--host`后不带参数则表示使用服务器的默认接口。

### https

-   类型：`boolean | http.HttpsServerOptions`

要启用 TLS 并启用 HTTP/2，请注意，如果同时使用了 `server.proxy` 选项，那么只会使用 TLS 协议。
您需要一个有效且可用的证书来配置服务器以使用 TLS。

### cors

-   类型：`boolean | CorsOptions`

您可以为开发服务器配置跨源资源共享（CORS）。默认情况下，CORS 功能被启用，并且允许所有来源。如果您需要自定义 CORS 的行为，可以传递一个[选项对象](https://github.com/expressjs/cors#configuration-options)来进行调整。如果您不希望启用 CORS，可以将该选项设置为 `false`。

### headers

-   类型：`OutgoingHttpHeaders`

您可以指定服务器响应时应包含的 HTTP 头部信息。

### proxy

-   类型：`Record<string, string | ProxyOptions>`

您可以为开发服务器设置自定义代理规则，通过提供一个 `{ key: options }` 格式的对象来实现。任何以键名开始的请求路径都将被代理到相应的目标。如果键名以 `^` 开头，它将被视为正则表达式。您可以使用 `configure` 选项来访问代理实例。
请注意，如果您设置了非相对的基础路径 `base`，则必须在每个键名前加上这个 `base`。
在特定场景下，您可能还需要配置底层的发展服务器，比如添加自定义中间件到内部的 connect 应用中。为了做到这一点，您需要编写自己的插件，并利用 `configureServer` 函数来应用更改。

示例：

```js
module.exports = {
    server: {
        proxy: {
            // 字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
            "/foo": "http://localhost:4567",
            // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
            "/api": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "")
            },
            // 正则表达式写法：http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
            "^/fallback/.*": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/fallback/, "")
            },
            // 使用 proxy 实例
            "/api": {
                target: "http://jsonplaceholder.typicode.com",
                changeOrigin: true,
                configure: (proxy, options) => {
                    // proxy 是 'http-proxy' 的实例
                }
            },
            // 代理 websockets 或 socket.io 写法：ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
            "/socket.io": {
                target: "ws://localhost:5174",
                ws: true
            }
        }
    }
};
```

### hmr

-   类型：`boolean | { port?: number; host?: string }`
-   默认：`true`

您可以禁用或自定义热模块替换（HMR）连接。如果您需要使用不同的 HTTP 服务器地址来处理 HMR 的 WebSocket 连接，您可以进行相应的配置。

#### hmr.port

-   类型：`number`
-   默认：`25679`

HMR 热更新 ws 协议端口，当你指定一个端口给开发服务器时，请注意，如果这个端口已经被其他应用程序使用，`Joker CLI` 将会 **自动寻找** 下一个可用的端口来启动服务。

#### hmr.host

-   类型：`string`
-   默认：`localhost`

指定`HMR服务器`监听的 IP 地址

### fs

-   类型：`FileSystemServeOptions`

可以通过配置`fs`来指定 Joker CLI 的文件索引范围。

```js
{
    strict: config.server?.fs?.strict ?? true,
    allow: config.server?.fs?.allow ?? []
}
```

#### fs.strict

-   类型：`boolean`
-   默认：`true`

启用严格模式，任何超出`root`范围的文件引用，都会作为异常处理。

#### fs.allow

-   类型：`string[]`
-   默认：`[]`

您可以指定哪些文件可以通过 `/@fs/` 路径进行服务。当 `server.fs.strict` 配置为 `true` 时，只有在此目录列表中的文件才被允许访问，任何不在列表中的尝试都将返回 403 禁止访问的错误。
您可以指定目录和文件，Joker CLI 会搜索这个根目录下可能存在的工作空间，并将其作为默认工作空间。一个有效的工作空间需要满足几个条件，如果不满足这些条件，Joker CLI 将默认使用项目根目录作为备选方案。
