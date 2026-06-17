import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";

/**
 * createSafeScene — renders a ConfigBase's children. No state management.
 * Fires scene events (select, back, filter) up to the handler chain.
 * State changes land in state.json via the handler → CLI → watcher loop.
 */
export function createSafeScene(
    container: HTMLElement,
    config: ConfigBase,
    ctx: SafeFireContext,
    renderChild?: (container: HTMLElement, child: ConfigBase, ctx: SafeFireContext) => void
): HTMLElement {

    const root = document.createElement("div");
    root.setAttribute("data-component", "scene");
    if (config.metadata?.name) root.setAttribute("data-name", config.metadata.name as string);

    // Wrap ctx to intercept and re-fire as scene events
    const handleEvent = (event) => {
        if (event.name === "select" || event.name === "back" || event.name === "filter") {
            ctx.fire(event.name, event.data ?? {});
        } else if (ctx) {
            ctx(event);
        }
    };

    // Render children — each child is a ConfigBase, rendered by the caller's renderChild
    if (config.children && renderChild) {
        for (const [key, child] of Object.entries(config.children)) {
            const childContainer = document.createElement("div");
            childContainer.setAttribute("data-scene-child", key);
            root.appendChild(childContainer);
            renderChild(childContainer, child, handleEvent);
        }
    }

    container.appendChild(root);
    return root;
}