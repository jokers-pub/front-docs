## 路由注册

该章节主要介绍如何去注册路由，并了解路由的配置规则。

目前提供两种路由注册方式：`初始化时配置路由规则`、`动态路由注册`。

### 初始化时配置路由规则

我们可以在路由初始化时，通过`routes`去配置我们整个项目的所有已知路由信息。

```ts
import { Router } from "@joker.front/rourter";

//我的区块页面
new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: MyPage }
    ]
});
```

### 动态路由注册

我们提供动态路由注册方法，该方法允许我们根据环境变量、动态变量等差异去动态管理路由匹配规则的注册。

```ts
let appRouter = new Router({
    routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", name:"parent" component: MyPage }
    ]
});

appRouter.addRoute({ path: "/index", component: MyPage });

//向已知路由添加子路由
appRouter.addRoute({ path: "/children", component: MyPage },'parent')
```

该方法支持两个参数的传入：

| 参数名称        | 说明                                                                                    | 参数类型                                     |
| --------------- | --------------------------------------------------------------------------------------- | -------------------------------------------- |
| route           | 需要添加的路由项                                                                        | `RouteRecordRaw`，与初始化路由配置项类型相同 |
| parentRouteName | 父路由节点的 name，这需要父路由是`命名路由`。该参数**可选**，不配置则作为一级路由配置。 | `RouteRecordName(string/symbol)`             |

> 值的注意的是，动态路由注册不允许注册一个项目的首页地址，当 Joker Router **初始化**时，会默认去加载当前地址/首页地址，所以通过该方法注册路由时**需要保证在渲染该页面前注册**。

### 路由配置项 [RouteRecordRaw]

`路由配置项`是 Joker Router 注册路由时必须要了解的数据类型，无论是初始化注册路由项还是动态注册路由，都需要按照 **RouteRecordRaw**类型去配置路由信息。

接下来的内容是`RouteRecordRaw`的相关属性说明：

### path [匹配规则]

`path`属性用于配置路由的匹配规则，path 提供的配置规则很丰富，可以是静态的路由地址例如：`/home/index`，也可以是动态的路由地址例如：`/user/:id`。接下来让我们详细的了解下路由的匹配规则。

首先`path`属性是一个`string字符串`类型，我们可以通过配置固定的静态地址来实现路由的规则设置：

```ts
new Router({
    routes: [
        {
            path: "/home/index"
        },
        {
            path: "user/list"
        }
    ]
});
```

除此之外我们也可以通过表达式的方式来配置动态匹配规则：

#### 动态参数

我们可以使用`:`的方式来设置我们的动态参数。其中 **:**后面的关键则代表我们动态参数的名称。

```ts
new Router({
    routes: [
        {
            path: "/user/:id"
        }
    ]
});

/**
 * /user/abc   => true
 * /user/123   => true
 * /user       => false
 * /user/a/b   => false
 */
```

当我们按上述规则配置后，当我们访问的地址`/user/abc` 、 `/user/123`等场景时都会被认为符合当前路由匹配规则。

在实际页面加载后，我们会将`/user/`后面的内容作为参数传递到[路由信息](/router/route)中的参数中，并将参数命名为**id**。

当我们访问`/user`或者`/user/abc/xxx`时，则该路由规则**不会被匹配**，因为`:`动态规则只配置了一次并不可重复。

#### 正则约束

我们允许在`:`动态参数后添加该参数的正则匹配规则，你可以在`()`内配置该参数的正则规则，例如：

```ts
new Router({
    routes: [
        {
            path: "/user/:id(\\d+)"
        }
    ]
});

/**
 * /user/abc   =>  false
 * /user/123   =>  true
 */
```

#### 动态拼接

动态参数可以和静态字符进行拼接来实现复杂的地址匹配规则，例如：

```ts
new Router({
    routes: [
        {
            path: "/home/:id([0-9]{2})hello"
        }
    ]
});

/**
 * /home/12hello   =>  true
 * /home/123hello  =>  false
 */
```

值的注意的是，虽然在表达式中使用了`动态+静态`的拼接，我们会在地址参数转换时正确的拆解参数变量，例如`/home/12hello`，拆解后的参数**id='12'**。

#### 可选参数

当我们需要对一个参数实现可选时，我们可以在变量后面添加`?`来实现， **它代表参数可选，而不是正则表达式的约束规则**。

```ts
new Router({
    routes: [
        {
            path: "/user/:id?"
        }
    ]
});

/**
 * /user/abc   => true
 * /user       => true
 * /user/a/b   => false
 */
```

带参数的时候需要在`()`后添加 **?** 。

```ts
new Router({
    routers: [
        {
            path: "/user/:id(\\d{2})?"
        }
    ]
});

/**
 * /user/12   => true
 * /user      => true
 * /user/1    => false
 * /user/123  => false
 * /user/1/2  => false
 */
```

#### 可循环

我们可以在动态参数后添加`+`/`*`来表示该参数可循环多次。其中`+`代表至少循环一次，`*`代表可循环+可选。

```ts
new Router({
    routes: [
        {
            path: "/user/:id(\\d+)+"
        }
    ]
});

/**
 * /user/1     => true
 * /user/1a    => false
 * /user/1/2/3 => true
 * /user       => false
 * /user/1/b   => false
 */
```

```ts
new Router({
    routes: [
        {
            path: "/user/:id*"
        }
    ]
});

/**
 * /user/abc   => true
 * /user       => true
 * /user/a/b   => true
 */
```

下面是复杂的静态字符拼接示例：

```ts
new Router({
    routes: [
        {
            path: "/user:id+"
        }
    ]
});

/**
 * /userabc   => true  参数为abc
 * /user       => false
 */
```

```ts
new Router({
    routes: [
        {
            path: "/:id(d+)+user"
        }
    ]
});

/**
 * /123user   => true  参数为123
 * /123+user  => false '+'为变量修饰符
 */
```

#### 可循环+可选 [*]

当我们配置`*`修饰符时，代表该变量为可选并且可循环。

```ts
new Router({
    routes: [
        {
            path: "/user/:id*"
        }
    ]
});

/**
 * /user/abc   => true
 * /user       => true
 * /user/a/b   => true
 */
```

### redirect [重定向]

我们可以通过配置`redirect`属性来实现路由重定向。

```js
new Router({
    routes: [
        {
            path: "/",
            redirect: "/home/index"
        }
    ]
});
```

上面的代码代表当我们没有任何地址时，会重定向到`/home/index`。
当我们配置 **redirect**，除了支持字符串类型的值外，还支持方法重定向和支持更多配置的路由配置。

更丰富的配置：

```ts
new Router({
    routes: [
        {
            path: "/",
            redirect: {
                name: "命名路由",
                params: { value: "1" }
            }
        },
        {
            path: "/",
            redirect: {
                hash: "/home/index",
                query: { value: "1" }
            }
        },
        {
            path: "/",
            redirect: {
                path: "/home/index"
            }
        }
    ]
});
```

自定义方法，该方法会传入目前的路由信息，并需要返回一个新的路由，返回的类型请参考上面的**更丰富的配置**提供的规范格式：

```ts
new Router({
    routes: [
        {
            path: "/",
            redirect: (to: RouteLocationBase) => {
                return {
                    name: "命名路由",
                    params: { value: "1" }
                };
            }
        }
    ]
});
```

### name [命名路由]

我们可以为一个路由配置项添加一个`name`属性，来为其进行命名，命名后的路由可以在跳转、添加路由等操作时，通过**name**快速的去设置。

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            name: "home"
        }
    ]
});
```

### alias 路由匹配别名

`alias`可用于对匹配地址的补充，也可以理解为对`path`匹配规则的别名。他可以配置一个字符串，也可以配置为字符串数组。值遵循`path`类型规范。

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            alias: "/home"
        },
        {
            path: "/user/list",
            alias: ["/user", "/u/list", "/user/all"]
        }
    ]
});
```

### meta [路由元数据]

`meta`作为路由的元数据属性，用于存储路由的自定义数据。配置元数据后我们可以在路由切面事件、路由信息中拿到这些数据做相应的业务操作。

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            meta: {
                param: "v1"
            }
        }
    ]
});
```

如何使用：

```ts
let appRouter = new Router({
    //...
});

appRouter.beforeRouteCallbacks.add((to, from) => {
    if (to.meta.param === "v1") {
        //TODO:
    }
});
```

或者在组件内通过`router`信息取值，详细可参考[路由信息](/router/route)。

```ts
import { router } from "@joker.front/router";

if (router.route.value.meta.param === "v1") {
    //TODO:
}
```

### children [子路由]

通过配置`children`可以配置当前路由的子路由项，这也就是我们通常说的`嵌套路由`。

```ts
new Router({
    routes: [
        {
            path: "/user",
            component: MyComponent,
            children: [
                { path: "list", component: userListComponent },
                { path: "info", component: userInfoComponent }
            ]
        }
    ]
});
```

通过上面例子可以看出，我们创建了一个`/user`路由，该路由下又存在两个子路由，若他们的**path**属性不是`/`开头，则按照拼接的方式进行子路由匹配规则的配置(**父路由 path/子路由 path**)。

- /user/list
- /user/info

当子路由 **path** 规则以 **/**开头，则忽略父路由 path 配置，例如：

```ts
new Router({
    routes: [
        {
            path: "/user",
            component: MyComponent,
            children: [
                { path: "/user/list", component: userListComponent },
                { path: "/user/info", component: userInfoComponent }
            ]
        }
    ]
});
```

上面例子最终也会解析为`/user/list`、`/user/info`两个路由。

[嵌套路由](/router/nested-routes)后续会有单独的章节进行详细介绍。

### component/components [路由组件]

我们可以通过`component/components`这两个属性来配置当前路由需要装载的视图组件。他们两个的区别是：

- `component`：当前路由只需要装载一个组件，也可以理解为布局文件中只有一个`<router-view>`标签。
- `components`: 当前路由需要装载多个组件，布局文件中存在多个命名容器`<router-view>`。

`<router-view>`，可通过查看[动态容器](/router/router-view)去学习了解。

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent
        },
        {
            path: "/user/index",
            components: {
                top: userTopComponent,
                bottom: userBottomComponent
            }
        }
    ]
});
```

当然`component/components`也支持异步懒加载组件：

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: () => import("index.joker")
        },
        {
            path: "/user/index",
            components: {
                top: userTopComponent,
                bottom: () => import("./user/bottom.joker")
            }
        }
    ]
});
```

### props [组件参数]

`props`属性一般用作为`component/components`组件进行参数配置的，我们在**props**中配置的参数，会在组件初始化时作为 `props`进行传递，可以在[组件属性](/base/component-property)中的 props 进行了解。

props 属性的配置需要根据`component/components`的不同而进行不同规则的配置，当我们使用`component`单个组件时，我们的 props 既是组件的中的 props 的类型约束：

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent,
            props: {
                p1: "v1"
            }
        }
    ]
});
```

当我们使用`components`时，那 props 则应该找`components`中的**key**进行区分，以便在运行时我们可以知道当前 props 是要传递给哪个组件：

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            components: {
                top: topComponent,
                bottom: bottomComponent
            },
            props: {
                top: {
                    p1: "v1"
                }
            }
        }
    ]
});
```

props 除了可以指定静态的对象，也可以定义为函数类型，并在渲染时根据要渲染地址自定义转换 props 的值，`component/components`两种方式对 props 函数的支持是一样的：

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent,
            props: (to) => {
                //TODO:  使用to来进行业务判断
                return {
                    message: "我是参数"
                };
            }
        }
    ]
});
```

### beforeEnter [进入路由前 HOOK]

`beforeEnter`作为当前路由的**hook**，当路由匹配成功即将进行路由渲染前，该方法会被执行。

当然我们使用`Router`的全局事件也可以实现进入路由前的定制化业务处理，该**hook**作为 route 项，在路由配置项层提供简单的 hook 能力。

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent,
            beforeEnter: (to, from, next) => {
                //TODO:
            }
        },
        {
            path: "/home/index",
            component: IndexComponent,
            beforeEnter: [
                (to, from) => {
                    //TODO：
                },
                (to, from) => {
                    //TODO：
                }
            ]
        }
    ]
});
```

关于`hook`函数类型，可参考[组件事件](/router/event)，他们都是遵循**NavigationCallback**类型规范。

### beforeLeave [跳出路由前 HOOK]

`beforeLeave`作为当前路由的**hook**，当路由跳出前，该方法会被执行。

当然我们使用`Router`的全局事件也可以实现进入路由前的定制化业务处理，该**hook**作为 route 项，在路由配置项层提供简单的 hook 能力。

```ts
new Router({
    routes: [
        {
            path: "/home/index",
            component: IndexComponent,
            beforeLeave: (to, from, next) => {
                //TODO:
            }
        },
        {
            path: "/home/index",
            component: IndexComponent,
            beforeLeave: [
                (to, from) => {
                    //TODO：
                },
                (to, from) => {
                    //TODO：
                }
            ]
        }
    ]
});
```

关于`hook`函数类型，可参考[组件事件](/router/event)，他们都是遵循**NavigationCallback**类型规范。

### keepalive [状态保持]

当前路由跳出时，已加载的视图组件是否要保持状态，以便在返回时恢复到保留状态时的组件。

关于保持状态，建议先了解[组件生命周期](/base/component-lifecycle)。

路由中的`keepalive`属性支持多种配置类型，不同的配置类型代表的含义不同（**默认 undefined**）：

- `true`: 一直保持存活，可以通过[跳转](/router/change)时使用 **refresh** 属性进行缓存销毁刷新。

- `'once'`:代表只存活一次，该组件只会从缓存中渲染一次，第二次渲染时则按照新组件执行，一般适用于`高频访问+低频更新`的路由节点。

- `false/undefined`: 代表不做状态保持。

```ts
new Router({
    routes: [
        {
            path: "/product/index",
            component: IndexComponent,
            keepalive: "once"
        }
    ]
});
```

更多的使用方式，可通过[状态保持](/router/keepalive)进行学习了解。
