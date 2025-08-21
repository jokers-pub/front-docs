import { getLang } from "../utils";

export function getNavData() {
    if (getLang() === "zh-CN") {
        return [
            { title: "首页", path: "/index" },
            { title: "核心", path: "/base" },
            { title: "路由", path: "/router" },
            { title: "CLI", path: "/cli" },
            { title: "请求", path: "/requester" },

            { title: "UI库", class: "line", path: "https://ui.jokers.pub", target: "_blank" },
            { title: "官网", path: "https://www.jokers.pub", target: "_blank" },
            { title: "可视化工具", path: "https://viscode.jokers.pub", target: "_blank" }
        ];
    } else {
        return [
            { title: "Home", path: "/en/index" },
            { title: "Core", path: "/en/base" },
            { title: "Router", path: "/en/router" },
            { title: "CLI", path: "/en/cli" },
            { title: "Request", path: "/en/requester" },
            { title: "UI Library", class: "line", path: "https://ui.jokers.pub/en", target: "_blank" },
            { title: "Official Website", path: "https://www.jokers.pub/en", target: "_blank" },
            { title: "Visualization Tool", path: "https://viscode.jokers.pub/en", target: "_blank" }
        ];
    }
}
