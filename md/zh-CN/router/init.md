## 初始化路由

该章主要介绍，如何去初始化`Joker Router`，并介绍初始化时可配置的相关参数。

### 初始化

`Joker Router`提供 **Router**类，用于初始化路由。

```ts
import { Router } from "@joker.front/rourter";

new Router({
    history: new WebHashHistory(),
    base: "",
    scrollBehavior: (to, from, savePosition) => {
        //路由跳转后滚动条自定义操作方法
    },
    loggerLeve:"warn"
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});
```

### history [历史记录模式]

`histroy` 属性允许我们自定义路由历史模式，目前支持`HTML history`和`Hash history` 两种模式，默认我们将采用`Hash`模式去管理我们的路由历史。

```ts
import { WebHistory, WebHashHistory } from "@joker.front/rourter";

new Router({
    history: new WebHashHistory(),

    //或者
    history: new WebHistory()
});
```

`HTML history`和`Hash history` 历史模式详细内容可通过 [历史记录模式](/router/history) 去了解。

### base [路由根]

通过该属性我们可以为所有的路由配置增加一个根节点，默认`base`为空。

例如我们定义一个`/index`的路由地址：

```ts
new Router({
    routes: [{ path: "/index", component: MyPage }]
});
```

当我们不配置 base 属性时，我们可以通过访问`#/index`来访问该路由页面。

```ts
new Router({
    base:"demo"
    routes: [{ path: "/index", component: MyPage }]
});
```

当我们配置`base`属性为**demo**后，我们即可访问`#/demo/index`来访问该路由。

`base`配置后会对所有注册路由生效，都会再其起始位置添加路由文根。

### scrollBehavior [滚动行为]

`scrollBehavior`属性允许我们在路由跳转后去处理滚动条行为，该属性为方法类型，并提供`来源`、`去向`、`目标路由之前存储的滚动条位置`。

我们可以通过该方法来自定义滚动条的行为：

```ts
new Router({
    scrollBehavior() {
        window.scrollTo(0, 0);
    }
});
```

详细参数类型及使用方式，可通过后面的 [滚动行为](/router/scroll) 去学习了解。

### loggerLeve [日志级别]

`loggerLeve`属性允许我们配置 Joker Router 的路由输出级别。

```ts
new Router({
    loggerLeve: "info"
});
```

通过配置不同的级别可实现：`调试`、`生产静默`等需求。默认日志等级为`warn`，只有出现警告、或者错误时才会输出。

配置级别权重如下：

`silent < error < warn < info`

| 可选值 | 说明                                           |
| ------ | ---------------------------------------------- |
| silent | 静默，不做任何日志输出                         |
| error  | 只输出错误日志                                 |
| warn   | 输出错误及警告日志                             |
| info   | 输出所有日志，一般用于 Joker Router 的内部调试 |

### routes [路由注册配置]

`routers`应该是你在使用 Joker Router 时最重要的一个属性，它负责注册你当前项目所有已知的(静态)路由信息。

通过该属性你也可以很清晰的查看该项目的所有路由页面地址及配置信息。

```ts
new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});
```

`routers`的配置规则非常丰富，你可以在后面的 [注册路由](/router/registry) 章节详细的去了解学习。
