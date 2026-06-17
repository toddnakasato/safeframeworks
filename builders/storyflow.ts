import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";

/**
 * createSafeStoryFlow — renders a sequence of scenes. No state management.
 * Fires story-flow events (select-node, navigate, step:click, story:play)
 * up to the handler chain. State lives in state.json.
 */
export function createSafeStoryFlow(
    container: HTMLElement,
    config: ConfigBase,
    ctx: SafeFireContext,
    renderChild?: (container: HTMLElement, child: ConfigBase, ctx: SafeFireContext) => void
): HTMLElement {

    const root = document.createElement("div");
    root.setAttribute("data-component", "story-flow");
    if (instanceId) root.setAttribute("data-name", instanceId);

    // Wrap onEvent to intercept and re-fire as story-flow events
    const handleEvent = (event) => {
        const storyEvents = ["select-node", "navigate", "step:click", "story:play"];
        if (storyEvents.includes(event.name)) {
            ctx.fire(event.name, event.data ?? {}, { instanceId });
        } else if (onEvent) {
            onEvent(event);
        }
    };

    // Render children — each child is a scene or step
    if (config.children && renderChild) {
        for (const [key, child] of Object.entries(config.children)) {
            const childContainer = document.createElement("div");
            childContainer.setAttribute("data-story-child", key);
            root.appendChild(childContainer);
            renderChild(childContainer, child, handleEvent);
        }
    }

    container.appendChild(root);
    return root;
}