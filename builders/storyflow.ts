import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { elAttrs } from "../utils/util";

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeStoryFlow(
    container: HTMLElement,
    config: ConfigBase,
    ctx: SafeFireContext,
    renderChild?: (container: HTMLElement, child: ConfigBase, ctx: SafeFireContext) => void
): HTMLElement {
    const root = document.createElement("div");
    root.setAttribute("data-component", "story-flow");
    if (config.metadata?.name) root.setAttribute("data-name", config.metadata.name as string);

    // Wrap ctx to intercept and re-fire as story-flow events
    const handleEvent = (event) => {
        const storyEvents = ["select-node", "navigate", "step:click", "story:play"];
        if (storyEvents.includes(event.name)) {
            ctx.fire(event.name, event.data ?? {});
        } else if (ctx) {
            ctx(event);
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
