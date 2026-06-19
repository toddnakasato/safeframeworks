import type { ConfigBase } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent, readList } from "../utils/util";

/*----------------------------------------------------------------------------------------------------
 *
 * Plan — ordered task list with impact priority, progress bar,
 * done/skip actions, expandable detail, and chat input.
 * Based on jitui PlanPanel.
 *
 ----------------------------------------------------------------------------------------------------*/

const IMPACT_ICONS: Record<string, string> = { critical: "!!", high: "!", medium: "·", low: " " };

export function createSafePlan(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const title = (metadata.title as string) ?? "Plan";
    const actionField = (metadata.actionField as string) ?? "action";
    const whyField = (metadata.whyField as string) ?? "why";
    const estimateField = (metadata.estimateField as string) ?? "estimate";
    const impactField = (metadata.impactField as string) ?? "impact";
    const unlocksField = (metadata.unlocksField as string) ?? "unlocks";
    const statusField = (metadata.statusField as string) ?? "status";
    const showChat = metadata.showChat !== false;

    const data = readList(config);

    const root = elAttrs("div", { "data-component": "plan" });
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "plan");

    if (data.length === 0) {
        const empty = elAttrs("div", { "data-role": "empty" });
        empty.textContent = "No steps in plan";
        root.appendChild(empty);
        container.appendChild(root);
        return root;
    }

    // Track state
    const steps = data.map((d, i) => ({
        ...d,
        _id: String(d.id ?? i),
        _status: String(d[statusField] ?? "pending"),
    }));
    let activeId: string | null = steps.find(s => s._status === "pending" || s._status === "active")?._id ?? null;

    /* ---- Header with progress bar ---- */
    const header = elAttrs("div", { "data-role": "header" });

    const progressBar = elAttrs("div", { "data-role": "progress-bar" });
    const progressFill = elAttrs("div", { "data-role": "progress-fill" });
    progressBar.appendChild(progressFill);
    header.appendChild(progressBar);

    const progressStats = elAttrs("div", { "data-role": "progress-stats" });
    header.appendChild(progressStats);

    root.appendChild(header);

    /* ---- Body: step list ---- */
    const body = elAttrs("div", { "data-role": "body" });

    function updateProgress() {
        const done = steps.filter(s => s._status === "done").length;
        const skipped = steps.filter(s => s._status === "skipped").length;
        const pct = Math.round(((done + skipped) / steps.length) * 100);
        const remaining = steps.filter(s => s._status === "pending" || s._status === "active")
            .reduce((sum, s) => sum + parseInt(String(s[estimateField] ?? "0")), 0);
        progressFill.style.width = `${pct}%`;
        progressStats.textContent = `${done}/${steps.length} done · ~${remaining} min left`;
    }

    function completeStep(id: string) {
        const step = steps.find(s => s._id === id);
        if (step) step._status = "done";
        ctx.fire("complete", { id });
        activeId = steps.find(s => s._status === "pending")?._id ?? null;
        renderSteps();
    }

    function skipStep(id: string) {
        const step = steps.find(s => s._id === id);
        if (step) step._status = "skipped";
        ctx.fire("skip", { id });
        activeId = steps.find(s => s._status === "pending")?._id ?? null;
        renderSteps();
    }

    function selectStep(id: string) {
        activeId = id;
        ctx.fire("select", { id });
        renderSteps();
    }

    function renderSteps() {
        body.replaceChildren();
        updateProgress();

        for (const step of steps) {
            const isActive = step._id === activeId;
            const isDone = step._status === "done" || step._status === "skipped";
            const impact = String(step[impactField] ?? "medium");

            const row = elAttrs("div", {
                "data-role": "step",
                "data-impact": impact,
                "data-status": step._status,
            });
            if (isActive) row.setAttribute("data-active", "true");
            row.onclick = () => selectStep(step._id);

            /* Icon */
            const icon = elAttrs("span", { "data-role": "step-icon" });
            icon.textContent = step._status === "done" ? "check" : step._status === "skipped" ? "—" : step._status === "active" ? "▸" : "○";
            row.appendChild(icon);

            /* Impact */
            const impactEl = elAttrs("span", { "data-role": "step-impact" });
            impactEl.textContent = IMPACT_ICONS[impact] ?? "·";
            row.appendChild(impactEl);

            /* Action text */
            const actionEl = elAttrs("span", { "data-role": "step-action" });
            actionEl.textContent = String(step[actionField] ?? "");
            row.appendChild(actionEl);

            /* Estimate */
            const estEl = elAttrs("span", { "data-role": "step-estimate" });
            estEl.textContent = String(step[estimateField] ?? "");
            row.appendChild(estEl);

            body.appendChild(row);

            /* Expanded detail */
            if (isActive && !isDone) {
                const detail = elAttrs("div", { "data-role": "step-detail" });

                const whyEl = elAttrs("div", { "data-role": "step-why" });
                whyEl.textContent = String(step[whyField] ?? "");
                detail.appendChild(whyEl);

                const unlocks = step[unlocksField];
                if (unlocks) {
                    const unlocksEl = elAttrs("div", { "data-role": "step-unlocks" });
                    unlocksEl.textContent = `Unlocks: ${unlocks}`;
                    detail.appendChild(unlocksEl);
                }

                const actions = elAttrs("div", { "data-role": "step-actions" });
                const btnDone = elAttrs("button", { "data-role": "btn-done" });
                btnDone.textContent = "Done check";
                btnDone.onclick = (e) => { e.stopPropagation(); completeStep(step._id); };
                actions.appendChild(btnDone);

                const btnSkip = elAttrs("button", { "data-role": "btn-skip" });
                btnSkip.textContent = "Skip →";
                btnSkip.onclick = (e) => { e.stopPropagation(); skipStep(step._id); };
                actions.appendChild(btnSkip);

                detail.appendChild(actions);
                body.appendChild(detail);
            }
        }
    }
    renderSteps();
    root.appendChild(body);

    /* ---- Chat bar ---- */
    if (showChat) {
        const chatBar = elAttrs("div", { "data-role": "chat-bar" });
        const chatInput = elAttrs("input", { "data-role": "chat-input" }) as HTMLInputElement;
        chatInput.type = "text";
        chatInput.placeholder = "e.g. 'complete step 1', 'status', 'add step'...";
        chatInput.onkeydown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && chatInput.value.trim()) {
                ctx.fire("send", { text: chatInput.value.trim() });
                chatInput.value = "";
            }
        };
        chatBar.appendChild(chatInput);
        root.appendChild(chatBar);
    }

    container.appendChild(root);
    return root;
}
