## Combined Reply 

This chapter mainly introduces what combined reply is and its use cases.

Before reading this chapter, please familiarize yourself with [Template Rendering](/base/render).  

### Why Use Combined Reply  

Joker Core's real-time rendering mechanism ensures synchronized updates between the UI and data state. Any changes in data are immediately reflected in the associated templates. This mechanism works well when handling events such as user interactions, where users expect real-time feedback. However, in certain scenarios—such as frequent internal data updates within a method—this immediacy can lead to performance issues, as every small data change triggers a rendering update.  

To address this problem, we introduce the **Combined Reply mechanism**. This approach allows all data updates within a logical processing unit (e.g., a method) to be collected first, optimized (e.g., deduplicated and merged), and rendered only once at the appropriate time. As a result, unnecessary intermediate rendering updates caused by frequent minor data changes are avoided, significantly improving performance. In short, this method centralizes updates at the right moment, achieving efficient page rendering with minimal performance cost.  

### How to Use  

The usage is very simple:  

```ts
import { combinedReply } from "@joker.front/core";

combinedReply(() => {
    // Write your code here
});
```  

Let’s compare the difference with and without `combinedReply` using a **change counter** example:  

!!!demo1!!!  

Now, observe the effect after applying `combinedReply`:  

!!!demo2!!!  

The examples above show that while the page ultimately updates to the correct data, without `combinedReply**, the DOM is updated **5 times** in the background.  

Next, let’s examine another example demonstrating how `combinedReply` **aggregates and optimizes subscriptions**—changes that ultimately lead to no value updates are ignored.  

!!!demo3!!!  

In this example, despite frequent modifications to `value`, since it remains **0** in the end, no data subscription updates are broadcasted.  

> **Note:** Since `combinedReply` defers rendering until execution completes, you **cannot immediately obtain the latest DOM** in the code during processing.