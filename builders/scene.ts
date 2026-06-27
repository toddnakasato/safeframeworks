import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { el, elAttrs, applyPaintState } from "../utils/util";

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

    const root = el("div");
    root.setAttribute("data-component", "scene");
    applyPaintState(root, config.metadata, "scene");

    if (config.metadata?.name) root.setAttribute("data-name", config.metadata.name as string);

    // Wrap ctx to relay all child events as scene events
    const handleEvent = (event: any) => {
        ctx.fire(event.name, event.data ?? {});
    };

    // Render children — each child is a ConfigBase, rendered by the caller's renderChild
    if (config.children && renderChild) {
        for (const [key, child] of Object.entries(config.children)) {
            const childContainer = el("div");
            childContainer.setAttribute("data-scene-child", key);
            root.appendChild(childContainer);
            renderChild(childContainer, child, handleEvent);
        }
    }

    // Fire scene-level events via delegated DOM handlers
    root.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
        if (!target) return;
        const action = target.getAttribute('data-action');
        if (action === 'select') {
            ctx.fire('select', { data: { ...target.dataset } });
        } else if (action === 'back') {
            ctx.fire('back', {});
        }
    });

    root.addEventListener('input', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches('[data-action="filter"]')) {
            ctx.fire('filter', { query: (target as HTMLInputElement).value });
        }
    });

    container.appendChild(root);
    return root;
}