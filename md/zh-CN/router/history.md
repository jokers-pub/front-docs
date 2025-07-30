## 历史记录模式

Joker Router 目前提供了两种历史记录模式，分别是`HTML History`和`HASH`。

本章主要介绍这两种模式的区别和如何自定义历史记录模式。

### WebHashHistory [HASH]

`WebHashHistory`模式是我们前端应用最广泛的路由方式之一，它通过在 URL 后添加哈希符（#）来处理路由跳转，从而避免了服务器的额外负担，因为这些带哈希符的 URL 不会被发送到服务器。然而，这种模式对搜索引擎优化（SEO）有一定的负面影响，因为搜索引擎通常不会抓取和索引带有哈希符的 URL。

```ts
import { Router, WebHashHistory } from "@joker.front/rourter";

new Router({
    history: new WebHashHistory()
});
```

### WebHistory [HTML5 模式]

采用`WebHashHistory`模式可以让 URL 看起来更接近传统静态页面的形式，例如`https://example.com/user/id`，这在用户体验上是一个很大的优势。然而，这也带来了一个挑战：由于我们的应用是基于单个页面的客户端应用，如果没有正确配置服务器，用户直接通过浏览器访问`https://example.com/user/id`可能会遇到 404 错误，这显然不是我们想要的。
幸运的是，解决这个问题并不复杂。你需要在服务器上设置一个简单的重定向路由，确保任何未匹配到静态资源的 URL 都会被重定向到你的应用程序的`index.html`页面。这样一来，无论用户通过什么方式访问，都能得到一致的页面展现，这对于提升用户体验和避免尴尬的 404 错误至关重要。

如果您对 SEO 有较高的要求，可以考虑采用 HTML5 的`history.pushState`API 来管理路由，这种方式不会在 URL 中留下哈希符，有助于提高页面在搜索引擎中的可发现性。

```ts
import { Router, WebHistory } from "@joker.front/rourter";

new Router({
    history: new WebHistory()
});
```

> 该模式需要在前端部署服务做相应的配置。

### 如何自定义历史记录模式

我们提供了`IRouteHistory`接口类型，你只需要实现该接口的所有属性和方法即可完成历史记录模式的创建。

```ts
export interface IRouteHistory {
    readonly base: string;

    readonly location: string;

    readonly state: HistoryState;

    push(to: string, data?: HistoryState): void;

    replace(to: string, data?: HistoryState): void;

    go(delta: number, triggerListeners?: boolean): void;

    listen(callBack: NavigationCallBack): () => void;

    createHref(location: string): string;

    destroy(): void;
}
```
