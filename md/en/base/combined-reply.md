## Combined Reply

This chapter mainly introduces what a combined reply is and its use cases.

Before reading this chapter, please first understand [Template Rendering](/base/render).

### Why Use Combined Reply

The instant rendering mechanism of Joker Core ensures the synchronous update between the interface and the data state. Any data change will be immediately reflected in the associated template. This mechanism is very effective when dealing with events such as user interactions because users expect to see real - time feedback. However, in some cases, such as frequent data updates inside a method, this immediacy may lead to performance issues because each data change will trigger a rendering update.

To solve this problem, we introduced the combined response mechanism. This approach allows all data updates to be completed within a certain logical processing unit (such as a method), and then these changes are collected uniformly and optimized, such as deduplication and merging of updates. In this way, the rendering operation is only actually executed when a real rendering update is needed, thus avoiding multiple rendering updates caused by frequent small - scale data changes during the intermediate process and significantly improving performance. In short, this method achieves efficient page rendering with the minimum performance cost by centrally handling updates at the appropriate time point.

### How to Use

Its usage is very simple:

```ts
import { combinedReply } from "@joker.front/core";

combinedReply(() => {
    // Write your code here
});
```

Let's use the change count method to look at an example without using the combined reply:

!!!demo1!!!

Next, let's see the effect after using the combined reply:

!!!demo2!!!

As can be seen from the above example, although the page is finally successfully updated to the latest data, without using the combined reply, it actually updated the DOM nodes 5 times in the background.

Next, let's look at another example, which mainly demonstrates the final result of the combined reply. After the final processing is completed, the data subscriptions are summarized and optimized, and if there is no value change, it will be ignored.

!!!demo3!!!

From the above example, we can find that although the `value` is changed frequently, since the final value is still **0**, no change broadcast of data subscription will be made.

> **Note:** Since we do not execute the `Render` operation during the execution of the combined reply, we cannot immediately obtain the latest DOM in the code.
