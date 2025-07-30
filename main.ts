import App from "./app.joker";
import { Router, WebHistory } from "@joker.front/router";
import DemoRow from "./common/components/demo-row.joker";
import DemoContainer from "./common/components/demo-container.joker";
import { registerGlobalComponent } from "@joker.front/core";
import Index from "./pages/index.joker";
import "@joker.front/ui";
import "@joker.front/ui/index.css";
import { getRouters } from "./common/datas/router";
import { getLang } from "./common/utils";

registerGlobalComponent({
    DemoRow: DemoRow,
    DemoContainer
});

let router = new Router({
    history: import.meta.define.routerType === "html5" ? new WebHistory() : undefined,
    base: getLang() === "zh-CN" ? "/cn" : "",
    routes: [
        {
            path: "/",
            component: Index
        },
        {
            path: "/index",
            component: Index
        },
        ...getRouters()
    ]
});

new App().$mount(document.getElementById("app"));
