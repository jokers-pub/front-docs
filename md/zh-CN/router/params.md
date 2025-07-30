## 参数传递

在路由跳转过程中，我们有很多中参数传递的方式，本章节主要介绍下这些传参的方式和使用场景。

### 地址参数传递

地址参数传递根据`History 模式不同`参数的传递种类也不同，他们都包含以下几种传值方式：

-   `URL Query`： 例如：example.html?param=1&name=zohar。
-   `path地址变量匹配`：根据**path**的变量配置，在运行时解析成参数存放在当前路由信息中。
-   `Router props`：可以在注册路由时配置组件参数，在路由加载时传到到页面实例中。
-   `跳转传值(name模式)`：在通过**push**/**replace**等方法跳转时可通过 name 跳转模式，传递`params`。

> 其中在`HTML History`模式下，由于路由匹配不再是**hash**，所以我们可以在该模式下使用`Hash`传递参数。

接下来我们分别介绍下这几种传值方式的使用，以及使用场景。

### URL Query

`URL Query`模式是我们可以使用 **?** 来定义页面参数。但是该种模式可能会造成页面的刷新，我们一般将这种模式用于多页面或者分享页面等场景下使用。

#### 参数传递

使用链接模式

```html
<a href="/index.html?user=zohar&age=30">DEMO</a>
```

使用方法跳转

```ts
push({
    path: "user/info",
    query: {
        user: "zohar",
        age: 30
    }
});
```

#### 获取参数

我们可以通过 JS 中的`window.location.search`属性来获取当前路由的 Query 参数，当然我们也可以通过`router.route.value`来获取参数，其中`router.route`可在后面[路由信息](/router/route)章节详细介绍。

```ts
import { router } from "@joker.front/router";

//获取query参数
router.route.value.query;
```

### 地址变量匹配 [path]

在了解地址变量匹配前，请先学习[注册路由](/router/registry)中的`path`属性规则，本小结主要介绍如何使用**path**规则来传递参数。

#### 参数传递

例如我们配置一个携带动态参数的 path：

```ts
new Router({
    routes: [
        {
            path: "/user/:userName/:userAge"
        }
    ]
});
```

#### 获取参数

当我们访问`#/user/zohar/30`该路由时，可以通过通过`router.route.value`来获取参数，其中`router.route`可在后面[路由信息](/router/route)章节详细介绍。

```ts
import { router } from "@joker.front/router";

//获取query参数
router.route.value.params;

/**
 * =====>输出
 * {
 *     userName:'zohar',
 *     userAge:'30'
 * }
 */
```

值得注意的是，由于我们是在地址中(string)去解析参数，所以所有参数的类型都应该是`string`。

### Router props [组件传参]

`Router props`组件传参，该种方式和其他的方式不同，我们会将参数以`props`传递到要加载的组件中。

#### 参数传递

```ts
new Router({
    routes: [
        {
            path: "/user/info",
            component: userComponent,
            props: {
                userName: "zohar",
                userAge: 30
            }
        }
    ]
});
```

#### 获取参数

我们可以在该路由渲染的组件**userComponent**通过 props 来获取。

```html
<template>
    <ul>
        <li>姓名:@props.userName</li>
        <li>年龄:@props.userAge</li>
    </ul>
</template>

<script>
    import { Component } from "@joker.front/core";

    export class extends Component<{userName:string,userAge:number}>{
        //...
    }
</script>
```

> 这种传递方式不会在**URL**中展现，允许我们将其作为内部逻辑参数进行处理。例如，在下面的场景中，我们有两个路由指向同一个页面视图组件。在这种情况下，我们可以利用`props`来为这两个路由提供不同的参数，从而在相同的视图组件中实现不同的逻辑处理。

### 跳转传值(name 模式)

该模式是使用 router 中的 name 模式进行的参数传递，原理和`path`动态参数基本一致。

#### 传递参数

```ts
new Router({
    routes: [
        {
            name: "userInfo",
            path: "/user/:userName/:userAge"
            //...
        }
    ]
});
```

当我们使用 push 模式跳转时：

```ts
push({
    name: "userInfo",
    params: {
        userName: "zohar",
        userAge: 30
    }
});
```

#### 获取参数

当我们访问`#/user/zohar/30`该路由时，可以通过`router.route.value`来获取参数，其中`router.route`可在后面[路由信息](/router/route)章节详细介绍。

```ts
import { router } from "@joker.front/router";

//获取query参数
router.route.value.params;

/**
 * =====>输出
 * {
 *     userName:'zohar',
 *     userAge:'30'
 * }
 */
```

这里需要注意的是，当我们的一个路由项的`path`具备动态参数配置，并且也配置了`name`属性，那 Joker Router 在底层逻辑中会尝试将传递的参数根据`path`配置**反译**成`string`字符串，作为新的路由展示在浏览器地址中。

若参数不匹配或者没有动态参数时，将按照尝试转换后的 path 进行跳转。

例如：

```ts
new Router({
    routes: [
        {
            name: "userInfo",
            path: "/user/:userName/:userAge?"
            //...
        },
        {
            name: "userInfo2",
            path: "/user"
            //...
        }
    ]
});

push({
    name: "userInfo",
    params: {
        userName: "zohar",
        userAge: 30
    }
});
// 跳转后URL会更改为 ==> #/user/zohar/30

push({
    name: "userInfo",
    params: {
        userName: "zohar"
    }
});
// 跳转后URL会更改为 ==> #/user/zohar

push({
    name: "userInfo2",
    params: {
        userName: "zohar",
        userAge: 30
    }
});
// 跳转后URL仍然为 ==> #/user ，参数作为隐式传递
```

### meta [路由数据元]

我们可以通过在路由项中设置它的`meta`来配置一些静态值。

#### 传递参数

```ts
new Router({
    routes: [
        {
            path: "/user/userList",
            meta: {
                env: "dev"
            }
        }
    ]
});
```

#### 获取参数

可以通过`router.route.value`来获取参数，其中`router.route`可在后面[路由信息](/router/route)章节详细介绍。

```ts
import { router } from "@joker.front/router";

//获取query参数
router.route.value.meta;

/**
 * =====>输出
 * {
 *     env:'dev'
 * }
 */
```
