## Variables and Modes

This chapter mainly elaborates that Joker CLI provides developers with convenient environment variable operation functions, enabling developers to flexibly use these environment variables to perform various operations in the project code.

### Environment Variables

Joker CLI provides access to environment variables through the `import.meta.define` object.

1. We can configure `define` variables in the [configuration file](/cli/setting-plugin) of Joker CLI. We can configure different configuration files according to different environments.

```js
module.exports = {
    define: {
        appName: "Joker (Official Version)",
        version: "1.0.0"
    }
};
```

2. In the development project, we can obtain some of the defined environment variables through the `import.meta.define` variable.

```ts
console.log(import.meta.define.appName); // Joker (Official Version)

console.log(import.meta.define.version); // 1.0.0

console.log(import.meta.define.date); // undefined
```

### Modes

When starting the Joker command, we can specify the current running mode through `--mode`. Commonly, we configure it as `development` or `production`. Of course, you can also customize the running mode.

In the development code, we can obtain the current running mode through `process.env.NODE_ENV`.

```ts
console.log(process.env.NODE_ENV);
```

### HTML Environment Variables

Joker ClI also supports replacing environment variables in HTML files. Any property in `import.meta.define` can be used in HTML files through the special **%variable%** syntax:

```html
<h1>Welcome to use %appName%</h1>
<p>The current version is %version%</p>
```

If the environment variable does not exist in `import.meta.define`, such as %date% which does not exist, it will be ignored and not replaced. This is different from `import.meta.define.dete` in JS, where it will be replaced with **undefined** in JS.

> HTML variables are only for variable conversion in html files and will not be converted for templates in Joker.
