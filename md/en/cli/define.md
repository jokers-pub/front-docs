## Variables and Patterns

This chapter explains how the Joker CLI provides developers with convenient environment variable operations, enabling flexible use of these variables for various tasks within project code.

### Environment Variables

Joker CLI offers access to environment variables through the `import.meta.define` object.

1. We can configure define variables in the Joker CLI [configuration file](/cli/setting-plugin). Different configuration files can be set up for different environments.

```js
module.exports = {
    define: {
        appName: "Joker (Release Version)",
        version: "1.0.0"
    }
};
```

2. In development projects, we can access the defined environment variables via the `import.meta.define` variable.

```ts
console.log(import.meta.define.appName); // Joker (Release Version)

console.log(import.meta.define.version); // 1.0.0

console.log(import.meta.define.date); // undefined
```

### Modes

When executing Joker CLI commands, we can specify the running mode via the `--mode` flag. Common configurations include `development` and `production`, though custom modes can also be defined.

Within the development code, the current running mode can be retrieved via `process.env.NODE_ENV`.

```ts
console.log(process.env.NODE_ENV);
```

### HTML Environment Variables

Joker CLI also supports environment variable substitution in HTML files. Any properties from `import.meta.define` can be referenced in HTML files using the special **%variable%** syntax:

```html
<h1>Welcome to %appName%</h1>
<p>Current version: %version%</p>
```

If an environment variable doesn't exist in `import.meta.define` (e.g., %date%), it will be ignored and not replaced. This differs from JS behavior, where `import.meta.define.date` would be replaced with **undefined**.

> Note: HTML variable substitution only applies to variables in HTML files. Joker template files will not undergo this transformation.