import type { ConfigBase } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent, readList } from "../utils/util";

/*----------------------------------------------------------------------------------------------------
 *
 * SkillUp — quiz-based learning panel. Question cards with multiple choice,
 * skill mastery bars, streak/accuracy metrics. Based on jitui SkillUpPanel.
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeSkillUp(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const title = (metadata.title as string) ?? "SkillUp";
    const questionField = (metadata.questionField as string) ?? "question";
    const choicesField = (metadata.choicesField as string) ?? "choices";
    const correctField = (metadata.correctField as string) ?? "correct";
    const explanationField = (metadata.explanationField as string) ?? "explanation";
    const skillField = (metadata.skillField as string) ?? "skill";

    const data = readList(config);

    const root = elAttrs("div", { "data-component": "skillup" });
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "skillup");

    if (data.length === 0) {
        const empty = elAttrs("div", { "data-role": "empty" });
        empty.textContent = "No questions available";
        root.appendChild(empty);
        container.appendChild(root);
        return root;
    }

    let questionIdx = 0;
    let streak = 0;
    let todayCorrect = 0;
    let todayTotal = 0;

    // Extract unique skills with mastery
    const skillMap = new Map<string, { name: string; correct: number; total: number }>();
    for (const q of data) {
        const s = String(q[skillField] ?? "General");
        if (!skillMap.has(s)) skillMap.set(s, { name: s, correct: 0, total: 0 });
    }

    /* ---- Header ---- */
    const header = elAttrs("div", { "data-role": "header" });
    const titleEl = elAttrs("span", {});
    titleEl.textContent = title;
    header.appendChild(titleEl);
    root.appendChild(header);

    /* ---- Stats bar ---- */
    const statsBar = elAttrs("div", { "data-role": "stats-bar" });

    function makeStat(value: string, label: string): HTMLElement {
        const stat = elAttrs("div", { "data-role": "stat" });
        const valEl = elAttrs("div", { "data-role": "stat-value" });
        valEl.textContent = value;
        stat.appendChild(valEl);
        const lblEl = elAttrs("div", { "data-role": "stat-label" });
        lblEl.textContent = label;
        stat.appendChild(lblEl);
        return stat;
    }

    const streakStat = makeStat(String(streak), "🔥 Streak");
    const todayStat = makeStat("0/0", "✅ Today");
    const accStat = makeStat("0%", "📊 Accuracy");
    statsBar.appendChild(streakStat);
    statsBar.appendChild(todayStat);
    statsBar.appendChild(accStat);
    root.appendChild(statsBar);

    /* ---- Body ---- */
    const body = elAttrs("div", { "data-role": "body" });
    const questionArea = elAttrs("div", {});
    const skillListEl = elAttrs("div", { "data-role": "skill-list" });

    function updateStats() {
        streakStat.querySelector("[data-role='stat-value']")!.textContent = String(streak);
        todayStat.querySelector("[data-role='stat-value']")!.textContent = `${todayCorrect}/${todayTotal}`;
        accStat.querySelector("[data-role='stat-value']")!.textContent = todayTotal > 0 ? `${Math.round((todayCorrect / todayTotal) * 100)}%` : "0%";
    }

    function renderQuestion() {
        questionArea.replaceChildren();
        const q = data[questionIdx % data.length];
        const choices = q[choicesField] as string[] ?? [];
        const correctIdx = Number(q[correctField] ?? 0);
        const explanation = String(q[explanationField] ?? "");
        const skill = String(q[skillField] ?? "");

        const card = elAttrs("div", { "data-role": "question-card" });

        const skillLabel = elAttrs("div", { "data-role": "question-skill" });
        skillLabel.textContent = skill;
        card.appendChild(skillLabel);

        const text = elAttrs("div", { "data-role": "question-text" });
        text.textContent = String(q[questionField] ?? "");
        card.appendChild(text);

        let revealed = false;
        for (let i = 0; i < choices.length; i++) {
            const choice = elAttrs("button", { "data-role": "choice" });
            const letter = elAttrs("span", { "data-role": "choice-letter" });
            letter.textContent = String.fromCharCode(65 + i);
            choice.appendChild(letter);
            const choiceText = elAttrs("span", { "data-role": "choice-text" });
            choiceText.textContent = String(choices[i] ?? "");
            choice.appendChild(choiceText);

            choice.onclick = () => {
                if (revealed) return;
                revealed = true;
                const isCorrect = i === correctIdx;
                todayTotal++;
                if (isCorrect) { todayCorrect++; streak++; } else { streak = 0; }

                // Update skill mastery
                const sm = skillMap.get(skill);
                if (sm) { sm.total++; if (isCorrect) sm.correct++; }

                choice.setAttribute("data-selected", "true");
                choice.setAttribute("data-correct", String(isCorrect));

                // Mark correct answer
                const allChoices = card.querySelectorAll("[data-role='choice']");
                allChoices[correctIdx]?.setAttribute("data-answer", "true");

                // Show explanation
                const expl = elAttrs("div", { "data-role": "explanation" });
                expl.textContent = explanation;
                card.appendChild(expl);

                ctx.fire("answer", { questionId: String(q.id ?? questionIdx), choiceIndex: i, correct: isCorrect ? 1 : 0 });
                updateStats();
                renderSkills();

                setTimeout(() => { questionIdx++; renderQuestion(); }, 2500);
            };
            card.appendChild(choice);
        }

        questionArea.appendChild(card);
    }

    function renderSkills() {
        skillListEl.replaceChildren();
        for (const [, skill] of skillMap) {
            const mastery = skill.total > 0 ? Math.round((skill.correct / skill.total) * 100) : 50;

            const row = elAttrs("div", { "data-role": "skill-row" });
            row.onclick = () => ctx.fire("select", { skill: skill.name });

            const icon = elAttrs("span", { "data-role": "skill-icon" });
            icon.textContent = "📚";
            row.appendChild(icon);

            const name = elAttrs("span", { "data-role": "skill-name" });
            name.textContent = skill.name;
            row.appendChild(name);

            const masteryEl = elAttrs("span", { "data-role": "skill-mastery" });
            masteryEl.textContent = `${mastery}%`;
            row.appendChild(masteryEl);

            skillListEl.appendChild(row);

            const bar = elAttrs("div", { "data-role": "skill-bar" });
            const fill = elAttrs("div", { "data-role": "skill-bar-fill" });
            fill.style.width = `${mastery}%`;
            bar.appendChild(fill);
            skillListEl.appendChild(bar);
        }
    }

    renderQuestion();
    renderSkills();

    body.appendChild(questionArea);
    body.appendChild(skillListEl);
    root.appendChild(body);

    container.appendChild(root);
    return root;
}
