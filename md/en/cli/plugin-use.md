## Using Plugins  

This section primarily covers how to use plugins.  

Joker CLI supports feature extension through plugins, benefiting from `Rollup`'s powerful plugin interface and Joker CLI's unique additional configuration options. This allows users of Joker CLI to fully leverage `Rollup`'s rich plugin ecosystem to enhance the tool's functionalities.  

### How to Use  

To use a plugin, you first need to add it to your project's `devDependencies` file and then import the plugin in the `plugins` array within the project's `joker.config.js` configuration file. For example, if you wish to support legacy browsers, you can use the officially provided plugin `@joker.front/cli-plugin-legacy` as follows:  

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

To ensure compatibility with specific Rollup plugins, it may be necessary to adjust the execution order of plugins during the build process or explicitly enable them during builds. Such operations are typically part of the internal mechanisms implemented by Joker CLI plugins. You can use the `enforce` modifier to control a plugin's position:  

-   `pre`: Ensures the plugin executes before Joker CLI core plugins.  
-   `default`: The plugin will execute in sequence after Joker CLI core plugins.  
-   `post`: The plugin will execute after Joker CLI's build process completes.  

This approach allows fine-grained control over plugin execution timing to meet various requirements.  

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

### Conditional Application  

By default, plugins are invoked in both development (`serve`) and production (`build`) modes. If you want a plugin to be applied only in a specific mode, you can specify it using the `apply` property, indicating whether the plugin should be invoked only in 'build' or 'serve' mode:  

```js  
const image = require("@rollup/plugin-image");  

module.exports = {  
    plugins: [  
        {  
            ...image(),  
            // This plugin takes effect only in build mode  
            apply: "build"  
        }  
    ]  
};  
```