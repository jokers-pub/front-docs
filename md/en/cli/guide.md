## Quick Start  

Joker CLI currently supports both development and production build capabilities. Users can execute concise commands to quickly utilize its various features.  

We support running Joker commands quickly via command options, and we also support configurations through the `joker.config.js` file for more advanced settings. For configuration details, refer to the [Configuration File](/cli/setting-public) section.  

### Installation & Usage  

1. First, install Joker CLI in your project using a package manager like `npm` or `pnpm`.  

```bash  
pnpm add @joker.front/cli  
```  

2. After installation, you can configure commands in your `package.json`:  

```json  
{  
    "scripts": {  
        "dev": "joker",  
        "build": "joker build --config=build.config.js"  
    }  
}  
```  

3. Run `npm run dev` in the project to start the development server.  

### server [Command]  

The `server` command launches the development server. Simply run `joker` to start it.  

```bash  
joker [root]  
```  

**Options**  

| Option            | Description                                                                 |
|------------------|---------------------------------------------------------------------------|  
| `--config <file>` | Specify a configuration file (`string`)                                   |  
| `--base <path>`   | Public base path (default: `/`) (`string`)                                |  
| `--log <level>`   | Log level (`[silent / error / warn / info / debug]`)                      |  
| `--mode <mode>`   | Set the environment mode (`string`)                                       |  
| `--host [host]`   | Specify the hostname (`string`)                                           |  
| `--port <port>`   | Specify the port (`number`)                                               |  
| `--open [path]`   | Automatically open the browser (default: `true`) (`boolean` / `string`)   |  

### build [Command]  

```bash  
joker build [root]  
```  

**Options**  

| Option             | Description                                                                 |
|------------------|---------------------------------------------------------------------------|  
| `--config <file>`  | Specify a configuration file (`string`)                                   |  
| `--base <path>`    | Public base path (default: `/`) (`string`)                                |  
| `--log <level>`    | Log level (`[silent / error / warn / info / debug]`)                      |  
| `--mode <mode>`    | Set the environment mode (`string`)                                       |  
| `--outDir <dir>`   | Output directory (default: `dist`) (`string`)                             |  
| `--sourcemap`      | Generate source map files (default: `false`) (`boolean` / `"inline"` / `"hidden"`) |  

### create [Initialize a Joker Project]  

```bash  
joker create [name]  
```  

Quickly create a new Joker project using this command.