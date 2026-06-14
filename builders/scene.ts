import { fireScene } from "../../safecontracts/src/contracts-emit";
import type { SceneEvent } from "../../safecontracts/src/contracts-emit";
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";

/**
 * createSafeScene — renders a ConfigBase's children. No state management.
 * Fires scene events (select, back, filter) up to the handler chain.
 * State changes land in state.json via the handler → CLI → watcher loop.
 */
export function createSafeScene(
    container: HTMLElement,
    config: ConfigBase,
    onEvent?: OnSafeEvent,
    renderChild?: (container: HTMLElement, child: ConfigBase, onEvent?: OnSafeEvent) => void
): HTMLElement {
    const instanceId = config.metadata?.name as string | undefined;

    const root = document.createElement("div");
    root.setAttribute("data-component", "scene");
    if (instanceId) root.setAttribute("data-name", instanceId);

    // Wrap onEvent to intercept and re-fire as scene events
    const handleEvent: OnSafeEvent = (event) => {
        if (event.name === "select" || event.name === "back" || event.name === "filter") {
            fireScene(onEvent, event.name as SceneEvent, event.data ?? {}, { instanceId });
        } else if (onEvent) {
            onEvent(event);
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
