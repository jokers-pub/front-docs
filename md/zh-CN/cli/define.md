## 变量与模式

该章节主要阐述了 Joker CLI 为开发人员提供了便捷的环境变量操作功能，使得开发者在项目代码中能够灵活地利用这些环境变量执行各种操作。

### 环境变量

Joker CLI 通过 `import.meta.define` 对象提供了环境变量的访问。

1. 我们可以在 Joker CLI 的[配置文件](/cli/setting-plugin)中配置 define 变量。我们可以根据不同的环境来配置不同的配置文件。

```js
module.exports = {
    define: {
        appName: "Joker （正式版本）",
        version: "1.0.0"
    }
};
```

2. 我们可以在开发项目中通过`import.meta.define`变量来获取我们定义的一些环境变量。

```ts
console.log(import.meta.define.appName); // Joker （正式版本）

console.log(import.meta.define.version); // 1.0.0

console.log(import.meta.define.date); // undefined
```

### 模式

我们在启动 Joker 命令时可以通过`--mode`去指定我们当前的运行模式，我们一般会配置为：`development`,`production`。当然你也可以自定义运行模式。

我们可以在开发代码中通过`process.env.NODE_ENV`来获取当前的运行模式。

```ts
console.log(process.env.NODE_ENV);
```

### HTML 环境变量

Joker ClI 还支持在 HTML 文件中替换环境变量。`import.meta.define` 中的任何属性都可以通过特殊的 **%变量%** 语法在 HTML 文件中使用：

```html
<h1>欢迎使用 %appName%</h1>
<p>当前版本为 %version%</p>
```

如果环境变量在 `import.meta.define` 中不存在，比如不存在的 %date%，则会将被忽略而不被替换，这与 JS 中的 `import.meta.define.dete` 不同，JS 中会被替换为 **undefined**。

> HTML 变量只针对 html 文件中的变量转换，对于 Joker 中 template 模板不会进行转换。
