## Event Bus

In addition to `parameter passing` and `events`, we also provide a global `Event Bus` to handle the needs of broadcast communication between events.

### Overview

`Event Bus` is an event bus architectural pattern that decouples event communication between components through a central event scheduling center. Compared with handling events directly within components, `Event Bus` allows events to be passed between different components without direct interaction between components, thereby **reducing** their **coupling degree**.

Typically, `Event Bus` is used to handle global events such as successful user login, window size adjustment, etc. These events are often associated with **specific actions** or **operations**, such as a user clicking a button or the size of the browser window changing.

`Event Bus` can be used within components or any script, but it needs to register and unload global events at appropriate times to ensure effective resource management and reasonable memory release.

### How to Use

Definition of Event Bus

```ts
import { EventBus } from "@joker.front/core";

export let userEvent = new EventBus<{
    login: { userName: string; id: string };
    registory: { userId: string };
}>();
```

Event Broadcasting

```ts
import { userEvent } from "./event-bus/user-event";

userEvent.trigger("login", {
    userName: "Zhang San",
    id: "123"
});
```

Event Listening

```ts
import { userEvent } from "./event-bus/user-event";

let destroyEvent = userEvent.on("login", (e, userInfo) => {
    let userName = userInfo.userName;
    //TODO:...
});
```

The event handling function will receive two parameters. The first parameter is the event handling object, and the second is the event parameter. The event handling object provides two properties for use:

- **stopPropagation**: Function - Prevents the event from continuing to broadcast
- **callTimes**: Number - How many times the event has been responded to during this processing

> When using `on` or `once` for event registration, a `destroy` function will be returned immediately after registration. You can call this function to immediately destroy the event registered this time. Of course, you can use the `off` method to delete it.
> After registering an event, a destruction method will be returned immediately, which can be called to unregister the event.
> When registering an event, you can use the `*` wildcard to receive all event processes, and you can get the current event name from the first parameter `e` of the event handling function.

```ts
import { userEvent } from "./event-bus/user-event";

//Unload all login events
userEvent.off("login");

//Unload all events under user
userEvent.off();
```

> We can specify the generic type when initializing the event bus to constrain the type of event parameters.

### API

| Method Name | Description                       | Parameters                                     |
| ----------- | --------------------------------- | ---------------------------------------------- |
| on          | Event registration                | Event name, event handling function            |
| off         | Event unload                      | Event name, event handling function (optional) |
| trigger     | Trigger event                     | Event name, event parameters (optional)        |
| once        | Event registration (respond once) | Event name, event handling function            |
