import Layout from "../layout.joker";
import { getLang } from "../utils";
export function getRouters() {
    let isZhCN = getLang() === "zh-CN";

    return [
        //#region  核心
        {
            path: "/base",
            component: Layout,
            children: [
                {
                    path: "",
                    redirect: `/base/introduction`
                },
                {
                    path: "introduction",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/introduction.joker")
                        : () => import("../../pages/en/base/introduction.joker")
                },
                {
                    path: "quick-start",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/quick-start.joker")
                        : () => import("../../pages/en/base/quick-start.joker")
                },
                {
                    path: "component",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/component.joker")
                        : () => import("../../pages/en/base/component.joker")
                },
                {
                    path: "component-lifecycle",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/component-lifecycle.joker")
                        : () => import("../../pages/en/base/component-lifecycle.joker")
                },
                {
                    path: "component-api",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/component-api.joker")
                        : () => import("../../pages/en/base/component-api.joker")
                },
                {
                    path: "component-property",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/component-property.joker")
                        : () => import("../../pages/en/base/component-property.joker")
                },
                {
                    path: "component-register",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/component-register.joker")
                        : () => import("../../pages/en/base/component-register.joker")
                },
                {
                    path: "event-bus",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/event-bus.joker")
                        : () => import("../../pages/en/base/event-bus.joker")
                },
                {
                    path: "template",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/template.joker")
                        : () => import("../../pages/en/base/template.joker")
                },
                {
                    path: "template-if",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/template-if.joker")
                        : () => import("../../pages/en/base/template-if.joker")
                },
                {
                    path: "template-for",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/template-for.joker")
                        : () => import("../../pages/en/base/template-for.joker")
                },
                {
                    path: "template-section",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/template-section.joker")
                        : () => import("../../pages/en/base/template-section.joker")
                },
                {
                    path: "template-event",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/template-event.joker")
                        : () => import("../../pages/en/base/template-event.joker")
                },
                {
                    path: "template-property",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/template-property.joker")
                        : () => import("../../pages/en/base/template-property.joker")
                },
                {
                    path: "style",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/style.joker")
                        : () => import("../../pages/en/base/style.joker")
                },
                {
                    path: "render",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/render.joker")
                        : () => import("../../pages/en/base/render.joker")
                },
                {
                    path: "ast",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/ast.joker")
                        : () => import("../../pages/en/base/ast.joker")
                },
                {
                    path: "vnode",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/vnode.joker")
                        : () => import("../../pages/en/base/vnode.joker")
                },
                {
                    path: "observer",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/observer.joker")
                        : () => import("../../pages/en/base/observer.joker")
                },
                {
                    path: "watcher",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/watcher.joker")
                        : () => import("../../pages/en/base/watcher.joker")
                },
                {
                    path: "combined-reply",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/base/combined-reply.joker")
                        : () => import("../../pages/en/base/combined-reply.joker")
                }
            ]
        },

        //#endregion

        //#region router
        {
            path: "/router",
            component: Layout,
            children: [
                {
                    path: "",
                    redirect: `/router/introduction`
                },
                {
                    path: "introduction",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/introduction.joker")
                        : () => import("../../pages/en/router/introduction.joker")
                },
                {
                    path: "guide",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/guide.joker")
                        : () => import("../../pages/en/router/guide.joker")
                },
                {
                    path: "init",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/init.joker")
                        : () => import("../../pages/en/router/init.joker")
                },
                {
                    path: "registry",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/registry.joker")
                        : () => import("../../pages/en/router/registry.joker")
                },
                {
                    path: "router-view",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/router-view.joker")
                        : () => import("../../pages/en/router/router-view.joker")
                },
                {
                    path: "nested-routes",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/nested-routes.joker")
                        : () => import("../../pages/en/router/nested-routes.joker")
                },
                {
                    path: "change",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/change.joker")
                        : () => import("../../pages/en/router/change.joker")
                },
                {
                    path: "params",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/params.joker")
                        : () => import("../../pages/en/router/params.joker")
                },
                {
                    path: "event",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/event.joker")
                        : () => import("../../pages/en/router/event.joker")
                },
                {
                    path: "route",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/route.joker")
                        : () => import("../../pages/en/router/route.joker")
                },
                {
                    path: "keepalive",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/keepalive.joker")
                        : () => import("../../pages/en/router/keepalive.joker")
                },
                {
                    path: "scroll",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/scroll.joker")
                        : () => import("../../pages/en/router/scroll.joker")
                },
                {
                    path: "history",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/router/history.joker")
                        : () => import("../../pages/en/router/history.joker")
                }
            ]
        },
        //#endregion

        //#region CLI
        {
            path: "/cli",
            component: Layout,
            children: [
                {
                    path: "",
                    redirect: `/cli/introduction`
                },
                {
                    path: "introduction",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/introduction.joker")
                        : () => import("../../pages/en/cli/introduction.joker")
                },
                {
                    path: "guide",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/guide.joker")
                        : () => import("../../pages/en/cli/guide.joker")
                },
                {
                    path: "define",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/define.joker")
                        : () => import("../../pages/en/cli/define.joker")
                },
                {
                    path: "dep",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/dep.joker")
                        : () => import("../../pages/en/cli/dep.joker")
                },
                {
                    path: "prod",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/prod.joker")
                        : () => import("../../pages/en/cli/prod.joker")
                },
                {
                    path: "setting-public",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/setting-public.joker")
                        : () => import("../../pages/en/cli/setting-public.joker")
                },
                {
                    path: "setting-server",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/setting-server.joker")
                        : () => import("../../pages/en/cli/setting-server.joker")
                },
                {
                    path: "setting-build",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/setting-build.joker")
                        : () => import("../../pages/en/cli/setting-build.joker")
                },
                {
                    path: "plugin-use",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/plugin-use.joker")
                        : () => import("../../pages/en/cli/plugin-use.joker")
                },
                {
                    path: "plugin-create",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/plugin-create.joker")
                        : () => import("../../pages/en/cli/plugin-create.joker")
                },
                {
                    path: "plugins",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/cli/plugins.joker")
                        : () => import("../../pages/en/cli/plugins.joker")
                }
            ]
        },
        //#endregion

        //#region plugins
        {
            path: "/requester",
            component: Layout,
            children: [
                {
                    path: "",
                    component: isZhCN
                        ? () => import("../../pages/zh-CN/plugins/request.joker")
                        : () => import("../../pages/en/plugins/request.joker")
                }
            ]
        }
        //#endregion
    ];
}
