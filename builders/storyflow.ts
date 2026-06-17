import { fireWithPayload } from "./payload-delegate";
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";

/**
 * createSafeStoryFlow — renders a sequence of scenes. No state management.
 * Fires story-flow events (select-node, navigate, step:click, story:play)
 * up to the handler chain. State lives in state.json.
 */
export function createSafeStoryFlow(
    container: HTMLElement,
    config: ConfigBase,
    onEvent?: OnSafeEvent,
    renderChild?: (container: HTMLElement, child: ConfigBase, onEvent?: OnSafeEvent) => void
): HTMLElement {
    const instanceId = config.metadata?.name as string | undefined;

    const root = document.createElement("div");
    root.setAttribute("data-component", "story-flow");
    if (instanceId) root.setAttribute("data-name", instanceId);

    // Wrap onEvent to intercept and re-fire as story-flow events
    const handleEvent: OnSafeEvent = (event) => {
        const storyEvents = ["select-node", "navigate", "step:click", "story:play"];
        if (storyEvents.includes(event.name)) {
            fireWithPayload(onEvent, "story-flow", event.name, event.data ?? {}, { instanceId });
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