## Event Bus

In addition to `parameter passing` and `events` for communication between components, we also provide a global `event bus` to handle the broadcast communication requirements between events.

### Overview

The `Event Bus` is an event-bus architecture pattern. It decouples the event communication between components through a central event dispatching center. Compared with components handling events directly internally, the `Event Bus` allows events to be passed between different components without direct interaction between components, thus **reducing** the **coupling** between them.

Typically, the `Event Bus` is used to handle global events, such as successful user logins, window size adjustments, etc. These events are often associated with **specific actions** or **operations**, such as a user clicking a button or a change in the browser window size.

The `Event Bus` can be used within components or in any script, but it needs to register and unload global events at appropriate times to ensure effective resource management and reasonable memory release.

### How to Use

Definition of the event bus

```ts
import { EventBus } from "@joker.front/core";

export let userEvent = new EventBus<{
    login: { userName: string; id: string };
    registory: { userId: string };
}>();
```

Broadcast of an event

```ts
import { userEvent } from "./event-bus/user-event";

userEvent.trigger("login", {
    userName: "Zhang San",
    id: "123"
});
```

Listening for an event

```ts
import { userEvent } from "./event-bus/user-event";

let destroyEvent = userEvent.on("login", (e, userInfo) => {
    let userName = userInfo.userName;
    //TODO:...
});
```

The event-handling function will receive two parameters. The first parameter is the event-handling object, and the second is the event parameter. The event-handling object provides two properties for use:

-   **stopPropagation**: Function. Prevents the event from being broadcast further.
-   **callTimes**: Number. Indicates how many times the event has been responded to during this processing.

> When using `on` or `once` to register an event, a `destroy` function will be immediately returned after registration. You can call this function to immediately destroy the event registered this time. Of course, you can also use the `off` method to delete it.
> After registering an event, a destruction method will be immediately returned. You can call this destruction method to cancel the registration of this event.
> When registering an event, you can use the `*` wildcard to receive the handling of all events. You can obtain the current event name from the first parameter `e` in the event-handling function.

```ts
import { userEvent } from "./event-bus/user-event";

// Unload all login events
userEvent.off("login");

// Unload all events under user
userEvent.off();
```

> We can specify a generic type when initializing the event bus to constrain the type of event parameters.

### API

| Method Name | Description                            | Parameters                                     |
| ----------- | -------------------------------------- | ---------------------------------------------- |
| on          | Event registration                     | Event name, event-handling function            |
| off         | Event unloading                        | Event name, event-handling function (optional) |
| trigger     | Trigger an event                       | Event name, event parameter (optional)         |
| once        | Event registration (respond only once) | Event name, event-handling function            |
