## History Modes

Joker Router currently provides two history modes: `HTML History` and `HASH`.

This chapter introduces the differences between these two modes and how to customize the history mode.

### WebHashHistory [HASH]

The `WebHashHistory` mode is one of the most widely used routing methods in frontend applications. It handles route navigation by adding a hash symbol (#) to the URL, thereby avoiding additional server overhead since these hash-based URLs are not sent to the server. However, this mode has a negative impact on search engine optimization (SEO), as search engines typically do not crawl or index URLs with hash symbols.

```ts
import { Router, WebHashHistory } from "@joker.front/rourter";

new Router({
    history: new WebHashHistory()
});
```

### WebHistory [HTML5 Mode]

The `WebHashHistory` mode allows URLs to appear more like traditional static page URLs, such as `https://example.com/user/id`, which provides a significant advantage in terms of user experience. However, this also presents a challenge: since our application is a client-side single-page application, if the server is not properly configured, users accessing `https://example.com/user/id` directly via the browser might encounter a 404 error, which is not what we want.
Luckily, resolving this issue is straightforward. You need to set up a simple redirect route on the server to ensure that any URL that doesn't match a static resource is redirected to your application's `index.html` page. This way, no matter how users access the application, they will see a consistent page display, which is crucial for improving user experience and avoiding awkward 404 errors.

If SEO is a high priority, consider using the HTML5 `history.pushState` API to manage routes. This approach does not leave hash symbols in the URL, which helps improve the page's discoverability in search engines.

```ts
import { Router, WebHistory } from "@joker.front/rourter";

new Router({
    history: new WebHistory()
});
```

> This mode requires corresponding configuration on the frontend deployment server.

### How to Customize the History Mode

We provide the `IRouteHistory` interface type. You only need to implement all properties and methods of this interface to create a custom history mode.

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