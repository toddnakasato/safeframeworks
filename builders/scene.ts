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

    // Paint intent attributes
    if (_selectedItem != null) root.setAttribute("data-selected-item", String(_selectedItem));
    if (_activeScene != null) root.setAttribute("data-active-scene", String(_activeScene));

    // External paint state (resolved from state.json by host)
    const _selectedItem = metadata.selectedItem ?? null;
    const _activeScene = metadata.activeScene ?? null;

    if (config.metadata?.name) root.setAttribute("data-name", config.metadata.name as string);

    // Wrap ctx to relay all child events as scene events
    const handleEvent = (event: any) => {
        ctx.fire(event.name, event.data ?? {});
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