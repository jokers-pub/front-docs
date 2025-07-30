## Using Plugins

This section mainly introduces how to use plugins.

Joker CLI supports functional expansion through plugins, thanks to the powerful plugin interface of `Rollup` and the unique additional configuration options of Joker CLI. This enables users of Joker CLI to fully utilize the rich plugin ecosystem of `Rollup` to enhance the functionality of the tool.

### How to Use

To use a plugin, you first need to add it to the `devDependencies` file of your project, and then introduce the plugin in the `plugins` array of the `joker.config.js` configuration file of the project. For example, if you want to support legacy browsers, you can use the officially provided plugin `@('@joker.front/cli-plugin-legacy')` like this:

```js
const { legacyPlugin } = require("@joker.front/cli-plugin-legacy");

module.exports = {
    plugins: [
        legacyPlugin({
            targets: ["chrome 80", "ie >= 10"]
        })
    ]
};
```

### Plugin Ordering

To ensure compatibility with specific Rollup plugins, it may be necessary to adjust the execution order of plugins during the build process or specifically enable these plugins during the build. Such operations are usually internal mechanisms implemented by Joker CLI plugins. You can use the `enforce` modifier to control the position of the plugin:

-   `pre`: Ensures that the plugin is executed before the core plugins of Joker CLI.
-   `default`: The plugin will be executed in sequence after the core plugins of Joker CLI.
-   `post`: The plugin will be executed after the completion of the Joker CLI build process.

In this way, you can precisely control the execution timing of plugins to meet different requirements.

```js
// joker.config.js
const image = require("@rollup/plugin-image");

module.exports = {
    plugins: [
        {
            ...image(),
            enforce: "pre"
        }
    ]
};
```

### On-demand Reference

By default, plugins are called in both development (serve) and production (build) modes. If you want a plugin to be used on-demand only in a specific mode, you can specify that the plugin is only called in the 'build' or'serve' mode by setting the `apply` property:

```js
const image = require("@rollup/plugin-image");

module.exports = {
    plugins: [
        {
            ...image(),
            // This plugin only takes effect in the build mode
            apply: "build"
        }
    ]
};
```
