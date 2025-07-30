## History Modes

Joker Router currently offers two history modes: `HTML History` and `HASH`.

This chapter mainly introduces the differences between these two modes and how to customize the history mode.

### WebHashHistory [HASH]

The `WebHashHistory` mode is one of the most widely used routing methods in front-end applications. It handles route navigation by appending a hash symbol (#) to the URL, which avoids additional burden on the server because URLs with hash symbols are not sent to the server. However, this mode has a certain negative impact on search engine optimization (SEO) because search engines usually do not crawl and index URLs with hash symbols.

```ts
import { Router, WebHashHistory } from "@joker.front/rourter";

new Router({
    history: new WebHashHistory()
});
```

### WebHistory [HTML5 Mode]

The `WebHashHistory` mode allows URLs to look more like those of traditional static pages, such as `https://example.com/user/id`, which is a significant advantage in terms of user experience. However, it also poses a challenge: since our application is a single-page client-side application, if the server is not configured correctly, users directly accessing `https://example.com/user/id` through the browser may encounter a 404 error, which is obviously not what we want.
Fortunately, solving this problem is not complicated. You need to set up a simple redirection route on the server to ensure that any URL that does not match a static resource will be redirected to the `index.html` page of your application. In this way, no matter how users access the application, they will get a consistent page display, which is crucial for improving the user experience and avoiding embarrassing 404 errors.

If you have high requirements for SEO, you can consider using the `history.pushState` API of HTML5 to manage routes. This method does not leave a hash symbol in the URL, which helps improve the page's discoverability in search engines.

```ts
import { Router, WebHistory } from "@joker.front/rourter";

new Router({
    history: new WebHistory()
});
```

> This mode requires corresponding configuration on the front-end deployment service.

### How to Customize the History Mode

We provide the `IRouteHistory` interface type. You only need to implement all the properties and methods of this interface to create a custom history mode.

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
