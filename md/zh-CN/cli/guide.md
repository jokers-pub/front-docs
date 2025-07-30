## 快速入门

Joker CLI 目前具备开发与生产构建的功能，用户可执行简洁的命令来迅速利用其各项能力。

我们支持通过命令选项的模式快速的执行 Joker 命令，我们也支持通过`joker.config.js`配置文件的形式来实现更多的配置，配置文件可参考[配置文件](/cli/setting-public)章节了解。

### 安装使用

1. 首先在项目中通过`npm`/`pnpm`等包管理工具来安装 Joker CLI。

```bash
pnpm add @joker.front/cli
```

2. 安装完成后，我们可以在`package.json`中配置我们的命令：

```json
{
    "scripts": {
        "dev": "joker",
        "build": "joker build --config=build.config.js"
    }
}
```

3. 我们可以在项目内使用`npm run dev`的方式来开启我们的开发服务。

### server [命令]

`server`命令是我们的开发服务，我们可以直接执行`joker`命令来开启 server 开发服务。

```bash
joker [root]
```

选项

| 选项              | 说明                                                                   |
| ----------------- | ---------------------------------------------------------------------- |
| `--config <file>` | 使用指定的配置文件 `(string)`                                          |
| `--base <path>`   | 公共基础路径`（默认为：/）(string)`                                    |
| `--log <leve>`    | 日志输出级别`[silent / error / warn / info / debug]`                   |
| `--mode <mode>`   | 设置环境模式 `(string)`                                                |
| `--host [host]`   | 指定主机名称 `(string)`                                                |
| `--port <port>`   | 指定端口 (number)                                                      |
| `--open [path]`   | 是否默认打开浏览器，可指定自定义地址 `(默认为 true)(boolean / string)` |

### build [构建]

```bash
joker build [root]
```

选项

| 选项              | 说明                                                                         |
| ----------------- | ---------------------------------------------------------------------------- |
| `--config <file>` | 使用指定的配置文件 `(string)`                                                |
| `--base <path>`   | 公共基础路径`（默认为：/）(string)`                                          |
| `--log <leve>`    | 日志输出级别`[silent / error / warn / info / debug]`                         |
| `--mode <mode>`   | 设置环境模式 `(string)`                                                      |
| `--outDir <dir>`  | 输出目录`（默认为：dist）(string)`                                           |
| `--sourcemap`     | 构建后输出 source map 文件`（默认为：false）(boolean / "inline" / "hidden")` |

### create [创建 Joker 项目]

```bash
joker create [name]
```

我们可以通过该命令来快速创建一个 Joker 开发项目。
