## Quick Start

Joker CLI currently has the functions of development and production build. Users can execute simple commands to quickly utilize its various capabilities.

We support quickly executing Joker commands through command - line options. We also support more configurations through the `joker.config.js` configuration file. You can refer to the [Configuration File](/cli/setting - public) chapter for details.

### Installation and Usage

1. First, install Joker CLI in the project using a package management tool such as `npm` or `pnpm`.

```bash
pnpm add @joker.front/cli
```

2. After the installation is complete, we can configure our commands in `package.json`:

```json
{
    "scripts": {
        "dev": "joker",
        "build": "joker build --config=build.config.js"
    }
}
```

3. We can start our development service by running `npm run dev` in the project.

### server [Command]

The `server` command is our development service. We can directly execute the `joker` command to start the server development service.

```bash
joker [root]
```

Options

| Option            | Description                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `--config <file>` | Use the specified configuration file `(string)`                                                              |
| `--base <path>`   | Public base path `(default: /)(string)`                                                                      |
| `--log <leve>`    | Log output level `[silent / error / warn / info / debug]`                                                    |
| `--mode <mode>`   | Set the environment mode `(string)`                                                                          |
| `--host [host]`   | Specify the host name `(string)`                                                                             |
| `--port <port>`   | Specify the port `(number)`                                                                                  |
| `--open [path]`   | Whether to open the browser by default. You can specify a custom address `(default: true)(boolean / string)` |

### build [Build]

```bash
joker build [root]
```

Options

| Option            | Description                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `--config <file>` | Use the specified configuration file `(string)`                                          |
| `--base <path>`   | Public base path `(default: /)(string)`                                                  |
| `--log <leve>`    | Log output level `[silent / error / warn / info / debug]`                                |
| `--mode <mode>`   | Set the environment mode `(string)`                                                      |
| `--outDir <dir>`  | Output directory `(default: dist)(string)`                                               |
| `--sourcemap`     | Output source map files after building `(default: false)(boolean / "inline" / "hidden")` |

### create [Create a Joker Project]

```bash
joker create [name]
```

We can use this command to quickly create a Joker development project.
