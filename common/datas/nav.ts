import { getLang } from "../utils";

export function getNavData() {
    if (getLang() === "zh-CN") {
        return [
            { title: "首页", path: "/cn/index" },
            { title: "核心", path: "/cn/base" },
            { title: "路由", path: "/cn/router" },
            { title: "CLI", path: "/cn/cli" },
            { title: "请求", path: "/cn/requester" },

            { title: "UI库", class: "line", path: "https://ui.jokers.pub/cn", target: "_blank" },
            { title: "官网", path: "https://www.jokers.pub/cn", target: "_blank" },
            { title: "可视化工具", path: "https://viscode.jokers.pub", target: "_blank" }
        ];
    } else {
        return [
            { title: "Home", path: "/index" },
            { title: "Core", path: "/base" },
            { title: "Router", path: "/router" },
            { title: "CLI", path: "/cli" },
            { title: "Request", path: "/requester" },
            { title: "UI Library", class: "line", path: "https://ui.jokers.pub", target: "_blank" },
            { title: "Official Website", path: "https://www.jokers.pub", target: "_blank" },
            { title: "Visualization Tool", path: "https://viscode.jokers.pub", target: "_blank" }
        ];
    }
}
