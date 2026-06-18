import type { ConfigBase } from "../../safecontracts/src/contracts";
import { el, applyPaintState, readRecord } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

type InputOption = { label: string; value: string };
type LookupRecord = { id: string; name: string };

const D = {
    locale: "en-US",
    currency: "USD",
    timezone: "UTC",
    fontSize: 12,
    tabSize: 2,
    decimalPlaces: 2,
    maxIcons: 5,
    filledIcon: "★",
    emptyIcon: "☆",
    defaultSelectMessage: "Select an Option...",
    selectSize: 4,
    editorHeight: "200px",
    sliderHeight: "8rem",
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    align: "left",
    valign: "top",
    textAlign: "left",
    defaultColor: "var(--sd-text)",
    pinLength: 6,
    rangeStartLabel: "From",
    rangeEndLabel: "To",
    signatureWidth: 400,
    signatureHeight: 150,
    penColor: "var(--sd-text)",
    penWidth: 2,
    tagSeparator: ",",
    maxTags: 0,
    maskChar: "_",
    addressFields: ["Street", "City", "State", "Zip", "Country"],
    lookupFoundMessage: "Found {count}. Select One.",
    lookupEmptyMessage: "-- Select Record --",
    signatureClearLabel: "Clear",
    richTextMinHeight: "4rem",
} as const;

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function applyMask(raw: string, mask: string, maskChar: string): string {
    if (!mask) return raw;
    const digits = raw.replace(/\D/g, "");
    let result = "";
    let di = 0;
    for (let i = 0; i < mask.length && di <= digits.length; i++) {
        if (mask[i] === "#") {
            if (di < digits.length) { result += digits[di]; di++; } else { result += maskChar; }
        } else {
            result += mask[i];
        }
    }
    return result;
}

function fmtCurrency(value: any, locale: string, currency: string, decimals: number): string {
    if (value == null || value === "") return "";
    return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number(value));
}
function fmtPercent(value: any, locale: string, decimals: number): string {
    if (value == null || value === "") return "";
    return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number(value)) + "%";
}
function fmtDate(value: any, locale: string, timezone: string): string {
    if (!value) return "";
    try { return new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit", timeZone: timezone }).format(new Date(value)); } catch { return String(value); }
}
function fmtDateTime(value: any, locale: string, timezone: string): string {
    if (!value) return "";
    try { return new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: timezone }).format(new Date(value)); } catch { return String(value); }
}
function fmtNumber(value: any, locale: string, decimals: number): string {
    if (value == null || value === "") return "";
    return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number(value));
}
function fmtFactorRate(value: any, decimals: number): string {
    if (value == null || value === "") return "";
    const n = parseFloat(value);
    return isNaN(n) ? String(value) : n.toFixed(decimals);
}

function formatDisplay(value: any, format: string | undefined, locale: string, currency: string, timezone: string, decimals: number): string {
    if (value == null || (value === "" && value !== 0 && value !== false)) return "";
    switch (format) {
        case "currency": return fmtCurrency(value, locale, currency, decimals);
        case "percent": return fmtPercent(value, locale, decimals);
        case "date": return fmtDate(value, locale, timezone);
        case "datetime": return fmtDateTime(value, locale, timezone);
        case "number": return fmtNumber(value, locale, decimals);
        case "factor-rate": return fmtFactorRate(value, decimals);
        default: return String(value ?? "");
    }
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeInput(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;

    // Self-extract record from config data (SafeRenderer does this for react)
    const record: Record<string, any> = readRecord(config);

    const inputType = (metadata.inputType as string) ?? "text";
    const displayFormat = metadata.displayFormat as string | undefined;
    const defaultText = (metadata.defaultText as string) ?? "";
    const placeholder = (metadata.placeholder as string) ?? "";
    const textAlign = (metadata.textAlign as string) ?? D.textAlign;
    const hideEdit = !!metadata.hideEdit;
    const hideCancel = !!metadata.hideCancel;
    const isLink = !!metadata.isLink;
    const maxLines = metadata.maxLines as number | undefined;
    const locale = (metadata.locale as string) ?? D.locale;
    const currencyCode = (metadata.currency as string) ?? D.currency;
    const timezone = (metadata.timezone as string) ?? D.timezone;
    const decimalPlaces = (metadata.decimalPlaces as number) ?? D.decimalPlaces;
    const options = (metadata.options as InputOption[]) ?? [];
    const defaultSelectMessage = (metadata.defaultSelectMessage as string) ?? D.defaultSelectMessage;
    const isMultiSelect = !!metadata.isMultiSelect;
    const selectSize = (metadata.selectSize as number) ?? D.selectSize;
    const hasPicklistFilter = !!metadata.hasPicklistFilter;
    const lookupRecords = (metadata.lookupRecords as LookupRecord[]) ?? [];
    const lookupFoundMessage = (metadata.lookupFoundMessage as string) ?? D.lookupFoundMessage;
    const lookupEmptyMessage = (metadata.lookupEmptyMessage as string) ?? D.lookupEmptyMessage;
    const min = (metadata.min as number) ?? D.min;
    const max = (metadata.max as number) ?? D.max;
    const step = (metadata.step as number) ?? D.step;
    const orientation = (metadata.orientation as string) ?? D.orientation;
    const showValue = metadata.showValue !== false;
    const gradientColors = metadata.gradientColors as string[] | undefined;
    const showTicks = !!metadata.showTicks;
    const dualRange = !!metadata.dualRange;
    const sliderHeight = (metadata.sliderHeight as string) ?? D.sliderHeight;
    const isVertical = orientation === "vertical";
    const maxIcons = (metadata.maxIcons as number) ?? D.maxIcons;
    const filledIcon = (metadata.filledIcon as string) ?? D.filledIcon;
    const emptyIcon = (metadata.emptyIcon as string) ?? D.emptyIcon;
    const editorHeight = (metadata.editorHeight as string) ?? D.editorHeight;
    const align = (metadata.align as string) ?? D.align;
    const valign = (metadata.valign as string) ?? D.valign;
    const showPasswordToggle = !!metadata.showPasswordToggle;
    const showClear = metadata.showClear !== false;
    const defaultColor = (metadata.defaultColor as string) ?? D.defaultColor;
    const accept = (metadata.accept as string) ?? undefined;
    const fileMultiple = !!metadata.multiple;
    const tagSeparator = (metadata.tagSeparator as string) ?? D.tagSeparator;
    const maxTagsNum = (metadata.maxTags as number) ?? D.maxTags;
    const suggestions = (metadata.suggestions as string[]) ?? [];
    const mask = (metadata.mask as string) ?? "";
    const maskCharVal = (metadata.maskChar as string) ?? D.maskChar;
    const pinLengthNum = (metadata.pinLength as number) ?? D.pinLength;
    const rangeStartLabel = (metadata.rangeStartLabel as string) ?? D.rangeStartLabel;
    const rangeEndLabel = (metadata.rangeEndLabel as string) ?? D.rangeEndLabel;
    const signatureWidth = (metadata.signatureWidth as number) ?? D.signatureWidth;
    const signatureHeight = (metadata.signatureHeight as number) ?? D.signatureHeight;
    const penColorVal = (metadata.penColor as string) ?? D.penColor;
    const penWidthNum = (metadata.penWidth as number) ?? D.penWidth;
    const signatureClearLabel = (metadata.signatureClearLabel as string) ?? D.signatureClearLabel;
    const richTextMinHeight = (metadata.richTextMinHeight as string) ?? D.richTextMinHeight;
    const addressFieldsList = (metadata.addressFields as string[]) ?? [...D.addressFields];

    const fieldName = (metadata.field as string) ?? (metadata.name as string) ?? Object.keys(record)[0] ?? "";
    const rawValue = record[fieldName];

    let isEditing = !!metadata.forceEditMode;
    let editValue: any = rawValue;
    let editValueMax: any = dualRange ? (Array.isArray(rawValue) ? rawValue[1] : Math.round(max * 0.75)) : null;
    let lookupSearchText = "";
    let showLookupSelect = false;
    let picklistFilterText = "";
    let showPicklistSelect = false;
    let showPassword = false;

    const root = el("div");
    root.setAttribute("data-component", "input");
    applyPaintState(root, metadata, "input");

    // External paint state (resolved from state.json by host)
    const _editing = metadata.editing ?? null;

    // Paint intent attributes
    if (_editing != null) root.setAttribute("data-editing", String(_editing));

    root.setAttribute("data-input-type", inputType);
    root.setAttribute("data-align", align);
    root.setAttribute("data-valign", valign);

    const fireEvent = (name: string, payload: any) => {
        ctx.fire(name, payload);
    };

    function getDisplayValue(): string {
        if (rawValue == null || (rawValue === "" && rawValue !== 0 && (rawValue as any) !== false)) return defaultText;
        if (inputType === "lookup") {
            const rec = lookupRecords.find((r) => r.id === rawValue);
            return rec ? rec.name : String(rawValue ?? defaultText);
        }
        if (inputType === "picklist") {
            if (isMultiSelect && Array.isArray(rawValue)) {
                const labels = rawValue.map((v: string) => options.find((o) => o.value === v)?.label ?? v).filter(Boolean);
                return labels.length > 0 ? labels.join(", ") : defaultText;
            }
            const opt = options.find((o) => o.value === rawValue);
            return opt ? opt.label : String(rawValue ?? defaultText);
        }
        if (inputType === "password") return "••••••••";
        if (inputType === "color") return String(rawValue ?? defaultColor);
        if (inputType === "tags") return Array.isArray(rawValue) ? rawValue.join(", ") : defaultText;
        if (inputType === "range-date") return Array.isArray(rawValue) ? `${rawValue[0] ?? ""} – ${rawValue[1] ?? ""}` : defaultText;
        if (inputType === "address" && typeof rawValue === "object" && rawValue) return Object.values(rawValue).filter(Boolean).join(", ");
        return formatDisplay(rawValue, displayFormat, locale, currencyCode, timezone, decimalPlaces);
    }

    function lookupPrompt(filtered: LookupRecord[]): string {
        return filtered.length > 0
            ? lookupFoundMessage.replace("{count}", String(filtered.length))
            : lookupEmptyMessage;
    }

    function handleEditClick() {
        isEditing = true;
        fireEvent("editmode", { editing: true });
        if (inputType === "lookup") { showLookupSelect = false; lookupSearchText = ""; }
        render();
    }

    function handleCancelClick() {
        isEditing = false;
        showLookupSelect = false; lookupSearchText = "";
        showPicklistSelect = false; picklistFilterText = "";
        if (inputType === "lookup") {
            fireEvent("change", { field: fieldName, value: null, recordName: null });
        } else {
            fireEvent("canceledit", { field: fieldName });
        }
        render();
    }

    function handleChange(newValue: any) {
        isEditing = false;
        fireEvent("change", { field: fieldName, value: newValue });
        render();
    }

    function wireField(inp: HTMLInputElement | HTMLTextAreaElement, opts?: { commitOnBlur?: boolean }) {
        const commitOnBlur = opts?.commitOnBlur !== false;
        inp.addEventListener("input", () => {
            fireEvent("textinput", { field: fieldName, value: inp.value });
        });
        inp.addEventListener("blur", () => {
            if (commitOnBlur && isEditing && inputType !== "lookup" && inputType !== "picklist" && root.contains(inp)) {
                handleChange(inp.value);
            }
        });
        inp.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter" && inputType !== "multiline-text" && inputType !== "text") {
                e.preventDefault();
                fireEvent("navigate", { field: fieldName, value: (e.target as HTMLInputElement).value });
                handleChange((e.target as HTMLInputElement).value);
            } else if (e.key === "Escape") {
                handleCancelClick();
            }
        });
    }

    function applySliderStyles(inp: HTMLInputElement) {
        // react applies these inline too — structural orientation/gradient intent
        if (isVertical) {
            (inp.style as any).writingMode = "vertical-lr";
            inp.setAttribute("data-direction", "rtl");
            inp.style.height = sliderHeight;
        }
        if (gradientColors) {
            inp.style.setProperty("--sd-slider-gradient", `linear-gradient(${isVertical ? "to top" : "to right"}, ${gradientColors.join(", ")})`);
            inp.setAttribute("data-gradient", "");
        }
    }

    function makeTextInput(type: string, value: any): HTMLInputElement {
        const inp = el("input", "field") as HTMLInputElement;
        inp.type = type;
        inp.setAttribute("data-text-align", textAlign);
        inp.value = value ?? "";
        if (placeholder || defaultText) inp.placeholder = placeholder || defaultText;
        return inp;
    }

    function buildEditIcon(): HTMLElement {
        const icon = el("span", "edit-icon", "✎");
        icon.onclick = () => handleEditClick();
        return icon;
    }

    function buildSwitchLabel(checked: boolean, interactive: boolean): HTMLElement {
        const label = el("label", "toggle-switch");
        const cb = el("input", "toggle-input") as HTMLInputElement;
        cb.type = "checkbox";
        cb.checked = checked;
        if (!interactive) cb.readOnly = true;
        else cb.onchange = () => { editValue = cb.checked; fireEvent("change", { field: fieldName, value: cb.checked }); };
        label.append(cb, el("span", "toggle-slider"));
        return label;
    }

    function buildEditMode(): HTMLElement {
        const wrap = el("div", "edit-mode");

        if (["text", "number", "date", "datetime", "password", "email", "phone", "url", "time", "currency", "multiline-text"].includes(inputType)) {
            let inp: HTMLInputElement | HTMLTextAreaElement;
            if (inputType === "multiline-text") {
                inp = el("textarea", "field") as HTMLTextAreaElement;
                inp.setAttribute("data-text-align", textAlign);
                inp.value = rawValue ?? "";
                if (placeholder || defaultText) inp.placeholder = placeholder || defaultText;
            } else {
                const typeMap: Record<string, string> = {
                    text: "text", number: "number", currency: "number", date: "date",
                    datetime: "datetime-local", password: showPassword ? "text" : "password",
                    email: "email", phone: "tel", url: "url", time: "time",
                };
                inp = makeTextInput(typeMap[inputType], rawValue);
                if (inputType === "currency") {
                    (inp as HTMLInputElement).step = decimalPlaces === 0 ? "1" : "0." + "0".repeat(decimalPlaces - 1) + "1";
                }
            }
            wireField(inp);
            wrap.appendChild(inp);

            if (inputType === "password" && showPasswordToggle) {
                const tog = el("span", "password-toggle", showPassword ? "🙈" : "👁");
                tog.onclick = () => { showPassword = !showPassword; render(); };
                wrap.appendChild(tog);
            }
        }

        if (inputType === "search") {
            const sw = el("div", "search-wrap");
            const inp = makeTextInput("search", editValue);
            const clear = el("span", "clear", "✕");
            inp.addEventListener("input", () => {
                editValue = inp.value;
                fireEvent("textinput", { field: fieldName, value: inp.value });
                clear.hidden = !(showClear && editValue);
            });
            inp.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter") { e.preventDefault(); handleChange(editValue); }
                else if (e.key === "Escape") { handleCancelClick(); }
            });
            clear.hidden = !(showClear && editValue);
            clear.onclick = () => { editValue = ""; fireEvent("change", { field: fieldName, value: "" }); inp.value = ""; clear.hidden = true; };
            sw.append(inp, clear);
            wrap.appendChild(sw);
        }

        if (inputType === "color") {
            const cw = el("div", "color-wrap");
            const picker = el("input", "color-picker") as HTMLInputElement;
            picker.type = "color";
            picker.value = editValue ?? defaultColor;
            const valSpan = el("span", "color-value", String(editValue ?? defaultColor));
            picker.addEventListener("input", () => {
                editValue = picker.value;
                valSpan.textContent = picker.value;
                fireEvent("change", { field: fieldName, value: picker.value });
            });
            cw.append(picker, valSpan);
            wrap.appendChild(cw);
        }

        if (inputType === "file") {
            const inp = el("input", "field") as HTMLInputElement;
            inp.type = "file";
            if (accept) inp.accept = accept;
            inp.multiple = fileMultiple;
            inp.onchange = () => {
                const files = Array.from(inp.files ?? []);
                fireEvent("change", { field: fieldName, value: files.map((f) => ({ name: f.name, size: f.size, type: f.type })) });
            };
            wrap.appendChild(inp);
        }

        if (inputType === "tags") {
            const tw = el("div", "tags-wrap");
            const list = el("div", "tags-list");
            (Array.isArray(editValue) ? editValue : []).forEach((tag: string, i: number) => {
                const t = el("span", "tag", tag);
                const rm = el("span", "tag-remove", "✕");
                rm.onclick = () => {
                    const next = (editValue as string[]).filter((_: string, j: number) => j !== i);
                    editValue = next;
                    fireEvent("change", { field: fieldName, value: next });
                    render();
                };
                t.appendChild(rm);
                list.appendChild(t);
            });
            const inp = el("input", "field") as HTMLInputElement;
            inp.type = "text";
            if (placeholder || defaultText) inp.placeholder = placeholder || defaultText;
            inp.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === tagSeparator) {
                    e.preventDefault();
                    const val = inp.value.trim();
                    if (val && (!maxTagsNum || ((editValue as string[])?.length ?? 0) < maxTagsNum)) {
                        const next = [...(Array.isArray(editValue) ? editValue : []), val];
                        editValue = next;
                        fireEvent("change", { field: fieldName, value: next });
                        render();
                    }
                } else if (e.key === "Escape") {
                    handleCancelClick();
                }
            });
            tw.append(list, inp);
            wrap.appendChild(tw);
        }

        if (inputType === "autocomplete") {
            const aw = el("div", "autocomplete-wrap");
            const inp = makeTextInput("text", editValue);
            const sugBox = el("div", "suggestions");
            const renderSuggestions = () => {
                sugBox.replaceChildren();
                const matches = editValue
                    ? suggestions.filter((s) => s.toLowerCase().includes(String(editValue).toLowerCase()))
                    : [];
                sugBox.hidden = !(editValue && matches.length > 0);
                for (const s of matches) {
                    const item = el("div", "suggestion", s);
                    item.onclick = () => { editValue = s; handleChange(s); };
                    sugBox.appendChild(item);
                }
            };
            inp.addEventListener("input", () => {
                editValue = inp.value;
                fireEvent("textinput", { field: fieldName, value: inp.value });
                renderSuggestions();
            });
            inp.addEventListener("blur", () => { setTimeout(() => { if (isEditing) handleChange(editValue); }, 150); });
            inp.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter") { e.preventDefault(); handleChange(inp.value); }
                else if (e.key === "Escape") { handleCancelClick(); }
            });
            renderSuggestions();
            aw.append(inp, sugBox);
            wrap.appendChild(aw);
        }

        if (inputType === "masked") {
            const inp = makeTextInput("text", editValue);
            if (mask) inp.placeholder = mask;
            inp.addEventListener("input", () => {
                const v = applyMask(inp.value, mask, maskCharVal);
                editValue = v;
                inp.value = v;
                fireEvent("change", { field: fieldName, value: v });
            });
            inp.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter") { e.preventDefault(); handleChange(inp.value); }
                else if (e.key === "Escape") { handleCancelClick(); }
            });
            wrap.appendChild(inp);
        }

        if (inputType === "pin") {
            const pw = el("div", "pin-wrap");
            const digits: HTMLInputElement[] = [];
            for (let i = 0; i < pinLengthNum; i++) {
                const d = el("input", "pin-digit") as HTMLInputElement;
                d.type = "text";
                d.maxLength = 1;
                d.value = String(editValue ?? "")[i] ?? "";
                d.addEventListener("input", () => {
                    const chars = String(editValue ?? "").split("");
                    chars[i] = d.value.slice(-1);
                    const next = chars.join("");
                    editValue = next;
                    if (next.length === pinLengthNum) fireEvent("change", { field: fieldName, value: next });
                    if (d.value && digits[i + 1]) digits[i + 1].focus();
                });
                d.addEventListener("keydown", (e: KeyboardEvent) => {
                    if (e.key === "Backspace" && !String(editValue ?? "")[i]) {
                        if (digits[i - 1]) digits[i - 1].focus();
                    } else if (e.key === "Escape") {
                        handleCancelClick();
                    }
                });
                digits.push(d);
                pw.appendChild(d);
            }
            wrap.appendChild(pw);
        }

        if (inputType === "range-date") {
            const rw = el("div", "range-date-wrap");
            const mkDate = (idx: number): HTMLInputElement => {
                const d = el("input", "field") as HTMLInputElement;
                d.type = "date";
                d.value = Array.isArray(editValue) ? editValue[idx] ?? "" : "";
                d.onchange = () => {
                    const cur = Array.isArray(editValue) ? editValue : ["", ""];
                    const next = idx === 0 ? [d.value, cur[1] ?? ""] : [cur[0] ?? "", d.value];
                    editValue = next;
                    fireEvent("change", { field: fieldName, value: next });
                };
                return d;
            };
            rw.append(el("label", "range-label", rangeStartLabel), mkDate(0), el("label", "range-label", rangeEndLabel), mkDate(1));
            wrap.appendChild(rw);
        }

        if (inputType === "signature") {
            const sw = el("div", "signature-wrap");
            const canvas = el("canvas", "signature-canvas") as HTMLCanvasElement;
            canvas.width = signatureWidth;
            canvas.height = signatureHeight;
            let drawing = false;
            canvas.onmousedown = (e: MouseEvent) => {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.beginPath();
                    ctx.moveTo(e.offsetX, e.offsetY);
                    ctx.strokeStyle = penColorVal;
                    ctx.lineWidth = penWidthNum;
                    drawing = true;
                }
            };
            canvas.onmousemove = (e: MouseEvent) => {
                if (drawing) {
                    const ctx = canvas.getContext("2d");
                    if (ctx) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); }
                }
            };
            canvas.onmouseup = () => {
                drawing = false;
                const dataUrl = canvas.toDataURL();
                editValue = dataUrl;
                fireEvent("change", { field: fieldName, value: dataUrl });
            };
            const clearBtn = el("button", "signature-clear", signatureClearLabel);
            clearBtn.onclick = () => {
                canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
                editValue = null;
                fireEvent("change", { field: fieldName, value: null });
            };
            sw.append(canvas, clearBtn);
            wrap.appendChild(sw);
        }

        if (inputType === "rich-text") {
            const rt = el("div", "rich-text-wrap");
            rt.contentEditable = "true";
            rt.style.minHeight = richTextMinHeight;
            rt.innerHTML = String(editValue ?? "");
            rt.addEventListener("blur", () => {
                const html = rt.innerHTML;
                editValue = html;
                fireEvent("change", { field: fieldName, value: html });
            });
            wrap.appendChild(rt);
        }

        if (inputType === "address") {
            const aw = el("div", "address-wrap");
            for (const af of addressFieldsList) {
                const inp = el("input", "field") as HTMLInputElement;
                inp.type = "text";
                inp.placeholder = af;
                inp.value = (editValue as any)?.[af] ?? "";
                inp.addEventListener("input", () => {
                    const next = { ...(typeof editValue === "object" && editValue ? editValue : {}), [af]: inp.value };
                    editValue = next;
                    fireEvent("change", { field: fieldName, value: next });
                });
                aw.appendChild(inp);
            }
            wrap.appendChild(aw);
        }

        if (inputType === "checkbox") {
            const cb = el("input", "field") as HTMLInputElement;
            cb.type = "checkbox";
            cb.checked = !!editValue;
            cb.onchange = () => { editValue = cb.checked; fireEvent("change", { field: fieldName, value: cb.checked }); };
            wrap.appendChild(cb);
        }

        if (inputType === "radio") {
            const rb = el("input", "field") as HTMLInputElement;
            rb.type = "radio";
            rb.checked = !!editValue;
            rb.onclick = () => {
                const v = !editValue;
                editValue = v;
                rb.checked = !!v;
                fireEvent("change", { field: fieldName, value: v });
            };
            wrap.appendChild(rb);
        }

        if (inputType === "toggle") {
            wrap.appendChild(buildSwitchLabel(!!editValue, true));
        }

        if (inputType === "picklist") {
            if (!hasPicklistFilter && !isMultiSelect) {
                const sel = el("select", "field") as HTMLSelectElement;
                sel.setAttribute("data-text-align", textAlign);
                const def = document.createElement("option");
                def.value = "";
                def.textContent = defaultSelectMessage;
                sel.appendChild(def);
                for (const o of options) {
                    const opt = document.createElement("option");
                    opt.value = o.value;
                    opt.textContent = o.label;
                    sel.appendChild(opt);
                }
                sel.value = rawValue ?? "";
                sel.onchange = () => { showPicklistSelect = false; picklistFilterText = ""; handleChange(sel.value); };
                wrap.appendChild(sel);
            } else if (!hasPicklistFilter && isMultiSelect) {
                const sel = el("select", "field") as HTMLSelectElement;
                sel.multiple = true;
                sel.size = selectSize;
                for (const o of options) {
                    const opt = document.createElement("option");
                    opt.value = o.value;
                    opt.textContent = o.label;
                    opt.selected = Array.isArray(rawValue) && rawValue.includes(o.value);
                    sel.appendChild(opt);
                }
                sel.onchange = () => { handleChange(Array.from(sel.selectedOptions).map((o) => o.value)); };
                wrap.appendChild(sel);
            } else if (hasPicklistFilter && !showPicklistSelect) {
                const inp = el("input", "filter") as HTMLInputElement;
                inp.type = "text";
                if (placeholder || defaultText) inp.placeholder = placeholder || defaultText;
                inp.value = picklistFilterText;
                inp.addEventListener("input", () => { picklistFilterText = inp.value; });
                inp.addEventListener("blur", () => {
                    if (picklistFilterText.trim()) { showPicklistSelect = true; render(); }
                });
                wrap.appendChild(inp);
            } else {
                const filtered = picklistFilterText
                    ? options.filter((o) => o.label.toLowerCase().includes(picklistFilterText.toLowerCase()))
                    : options;
                const sel = el("select", "field") as HTMLSelectElement;
                const def = document.createElement("option");
                def.value = "";
                def.textContent = defaultSelectMessage;
                sel.appendChild(def);
                for (const o of filtered) {
                    const opt = document.createElement("option");
                    opt.value = o.value;
                    opt.textContent = o.label;
                    sel.appendChild(opt);
                }
                sel.value = rawValue ?? "";
                sel.onchange = () => { showPicklistSelect = false; picklistFilterText = ""; handleChange(sel.value); };
                wrap.appendChild(sel);
            }
        }

        if (inputType === "lookup") {
            if (!showLookupSelect) {
                const inp = el("input", "lookup-search") as HTMLInputElement;
                inp.type = "text";
                if (placeholder || defaultText) inp.placeholder = placeholder || defaultText;
                inp.value = lookupSearchText;
                inp.addEventListener("input", () => {
                    lookupSearchText = inp.value;
                    fireEvent("textinput", { field: fieldName, value: inp.value });
                });
                inp.addEventListener("blur", () => {
                    if (lookupSearchText.trim()) { showLookupSelect = true; render(); }
                });
                wrap.appendChild(inp);
            } else {
                const filtered = lookupSearchText
                    ? lookupRecords.filter((r) => r.name.toLowerCase().includes(lookupSearchText.toLowerCase()))
                    : lookupRecords;
                const sel = el("select", "field") as HTMLSelectElement;
                const def = document.createElement("option");
                def.value = "";
                def.textContent = lookupPrompt(filtered);
                sel.appendChild(def);
                for (const r of filtered) {
                    const opt = document.createElement("option");
                    opt.value = r.id;
                    opt.textContent = r.name;
                    sel.appendChild(opt);
                }
                sel.onchange = () => {
                    const id = sel.value;
                    const rec = lookupRecords.find((r) => r.id === id);
                    isEditing = false;
                    showLookupSelect = false;
                    lookupSearchText = "";
                    fireEvent("change", { field: fieldName, value: id, recordName: rec?.name ?? id });
                    render();
                };
                wrap.appendChild(sel);
            }
        }

        if (inputType === "slider") {
            const sw = el("div", "slider-wrap");
            sw.setAttribute("data-orientation", orientation);
            if (dualRange) sw.setAttribute("data-dual", "true");
            if (showTicks) sw.setAttribute("data-ticks", "true");

            const valSpan = el("span", "slider-value");
            const updateValSpan = () => {
                valSpan.textContent = dualRange && Array.isArray(editValue)
                    ? `${editValue[0]}–${editValue[1]}`
                    : `${editValue ?? min}`;
            };

            if (dualRange) {
                const dr = el("div", "dual-range");
                const mkSlider = (track: string): HTMLInputElement => {
                    const s = el("input", "slider") as HTMLInputElement;
                    s.type = "range";
                    s.setAttribute("data-track", track);
                    s.min = String(min);
                    s.max = String(max);
                    s.step = String(step);
                    applySliderStyles(s);
                    return s;
                };
                const sMin = mkSlider("min");
                sMin.value = String(Array.isArray(editValue) ? editValue[0] : (editValue ?? min));
                const sMax = mkSlider("max");
                sMax.value = String(editValueMax ?? max);
                // react also positions the max track inline — now in CSS for dual-range sliders
                sMin.addEventListener("input", () => {
                    const v = Number(sMin.value);
                    const maxV = editValueMax ?? max;
                    if (v <= maxV) {
                        editValue = [v, maxV];
                        fireEvent("change", { field: fieldName, value: [v, maxV] });
                        updateValSpan();
                    } else {
                        sMin.value = String(Array.isArray(editValue) ? editValue[0] : min);
                    }
                });
                sMax.addEventListener("input", () => {
                    const v = Number(sMax.value);
                    const minV = Array.isArray(editValue) ? editValue[0] : (editValue ?? min);
                    if (v >= minV) {
                        editValueMax = v;
                        editValue = [minV, v];
                        fireEvent("change", { field: fieldName, value: [minV, v] });
                        updateValSpan();
                    } else {
                        sMax.value = String(editValueMax ?? max);
                    }
                });
                dr.append(sMin, sMax);
                sw.appendChild(dr);
            } else {
                const s = el("input", "slider") as HTMLInputElement;
                s.type = "range";
                s.min = String(min);
                s.max = String(max);
                s.step = String(step);
                s.value = String(editValue ?? min);
                applySliderStyles(s);
                s.addEventListener("input", () => {
                    const v = Number(s.value);
                    editValue = v;
                    fireEvent("change", { field: fieldName, value: v });
                    updateValSpan();
                });
                sw.appendChild(s);
            }

            if (showValue) { updateValSpan(); sw.appendChild(valSpan); }

            if (showTicks) {
                const ticks = el("div", "tick-marks");
                const count = Math.floor((max - min) / step) + 1;
                for (let i = 0; i < count; i++) ticks.appendChild(el("span", undefined, String(min + i * step)));
                sw.appendChild(ticks);
            }
            wrap.appendChild(sw);
        }

        if (inputType === "rating") {
            const rw = el("div", "rating-wrap");
            for (let i = 0; i < maxIcons; i++) {
                const icon = el("span", "rating-icon", i < (editValue ?? 0) ? filledIcon : emptyIcon);
                icon.setAttribute("data-filled", i < (editValue ?? 0) ? "true" : "false");
                icon.onclick = () => {
                    const v = i + 1 === editValue ? 0 : i + 1;
                    editValue = v;
                    fireEvent("change", { field: fieldName, value: v });
                    render();
                };
                rw.appendChild(icon);
            }
            wrap.appendChild(rw);
        }

        if (inputType === "code") {
            // Vanilla fallback: plain textarea instead of Monaco editor
            const cw = el("div", "code-wrap");
            const ta = el("textarea", "code-editor") as HTMLTextAreaElement;
            ta.style.height = editorHeight;
            ta.value = String(editValue ?? "");
            ta.addEventListener("input", () => {
                editValue = ta.value;
                fireEvent("change", { field: fieldName, value: ta.value });
            });
            ta.addEventListener("keydown", (e: KeyboardEvent) => { if (e.key === "Escape") handleCancelClick(); });
            cw.appendChild(ta);
            wrap.appendChild(cw);
        }

        if (!hideCancel) {
            const cancel = el("span", "cancel", "✕");
            cancel.onclick = () => handleCancelClick();
            wrap.appendChild(cancel);
        }

        return wrap;
    }

    function buildViewMode(): HTMLElement {
        const wrap = el("div", "view-mode");

        if (inputType === "checkbox" || inputType === "radio" || inputType === "toggle") {
            if (inputType === "checkbox") {
                const cb = el("input", "field") as HTMLInputElement;
                cb.type = "checkbox";
                cb.checked = !!editValue;
                cb.readOnly = true;
                cb.onclick = (e) => e.preventDefault();
                wrap.appendChild(cb);
            } else if (inputType === "radio") {
                const rb = el("input", "field") as HTMLInputElement;
                rb.type = "radio";
                rb.checked = !!editValue;
                rb.readOnly = true;
                rb.onclick = (e) => e.preventDefault();
                wrap.appendChild(rb);
            } else {
                const label = buildSwitchLabel(!!editValue, false);
                const cb = label.querySelector("input") as HTMLInputElement;
                cb.onclick = (e) => e.preventDefault();
                wrap.appendChild(label);
            }
            if (!hideEdit) wrap.appendChild(buildEditIcon());
            return wrap;
        }

        if (inputType === "slider") {
            const sw = el("div", "slider-wrap");
            sw.setAttribute("data-orientation", orientation);
            const s = el("input", "slider") as HTMLInputElement;
            s.type = "range";
            s.min = String(min);
            s.max = String(max);
            s.step = String(step);
            s.value = String(Array.isArray(editValue) ? editValue[0] : (editValue ?? min));
            s.disabled = true;
            applySliderStyles(s);
            sw.appendChild(s);
            if (showValue) {
                const displayVal = dualRange && Array.isArray(editValue) ? `${editValue[0]}–${editValue[1]}` : `${editValue ?? min}`;
                sw.appendChild(el("span", "slider-value", displayVal));
            }
            wrap.appendChild(sw);
            if (!hideEdit) wrap.appendChild(buildEditIcon());
            return wrap;
        }

        if (inputType === "rating") {
            const rw = el("div", "rating-wrap");
            for (let i = 0; i < maxIcons; i++) {
                const icon = el("span", "rating-icon", i < (editValue ?? 0) ? filledIcon : emptyIcon);
                icon.setAttribute("data-filled", i < (editValue ?? 0) ? "true" : "false");
                rw.appendChild(icon);
            }
            wrap.appendChild(rw);
            if (!hideEdit) wrap.appendChild(buildEditIcon());
            return wrap;
        }

        if (inputType === "code") {
            wrap.setAttribute("data-layout", "vertical");
            const cw = el("div", "code-wrap");
            const pre = el("pre", "code-view", String(editValue ?? ""));
            pre.style.height = editorHeight;
            cw.appendChild(pre);
            wrap.appendChild(cw);
            if (!hideEdit) wrap.appendChild(buildEditIcon());
            return wrap;
        }

        if (inputType === "color") {
            const cw = el("div", "color-wrap");
            const swatch = el("span", "color-swatch");
            swatch.style.setProperty("--sd-swatch-color", String(editValue ?? defaultColor));
            cw.append(swatch, el("span", "color-value", String(editValue ?? defaultColor)));
            wrap.appendChild(cw);
            if (!hideEdit) wrap.appendChild(buildEditIcon());
            return wrap;
        }

        if (inputType === "tags") {
            const list = el("div", "tags-list");
            for (const tag of (Array.isArray(editValue) ? editValue : [])) list.appendChild(el("span", "tag", String(tag)));
            wrap.appendChild(list);
            if (!hideEdit) wrap.appendChild(buildEditIcon());
            return wrap;
        }

        if (inputType === "signature" && editValue) {
            wrap.setAttribute("data-layout", "vertical");
            const img = el("img", "signature-image") as HTMLImageElement;
            img.src = String(editValue);
            img.alt = "signature";
            wrap.appendChild(img);
            if (!hideEdit) wrap.appendChild(buildEditIcon());
            return wrap;
        }

        const handleTextClick = () => {
            if (isLink) { fireEvent("navigate", { field: fieldName, value: rawValue }); return; }
            if (!hideEdit && inputType !== "lookup") handleEditClick();
        };

        if (displayFormat === "markdown") {
            // Vanilla fallback: raw markdown text (no react-markdown renderer)
            const md = el("div", "markdown", String(rawValue ?? defaultText));
            md.onclick = handleTextClick;
            wrap.appendChild(md);
        } else {
            const displayValue = getDisplayValue();
            const span = el("span", "value", displayValue || defaultText);
            if (isLink) span.setAttribute("data-link", "true");
            span.setAttribute("data-text-align", textAlign);
            if (maxLines) {
                // react applies the same clamp inline
                span.style.maxHeight = `${maxLines * 1.5}em`;
                span.style.overflow = "hidden";
            }
            span.onclick = handleTextClick;
            wrap.appendChild(span);
        }
        if (!hideEdit) wrap.appendChild(buildEditIcon());
        return wrap;
    }

    function render() {
        root.replaceChildren();
        const shouldShowEditMode = isEditing || !!metadata.forceEditMode;
        if (shouldShowEditMode) {
            root.setAttribute("data-mode", "edit");
            root.setAttribute("data-orientation", orientation);
            root.appendChild(buildEditMode());
        } else {
            root.setAttribute("data-mode", "view");
            if (inputType === "slider") root.setAttribute("data-orientation", orientation);
            else root.removeAttribute("data-orientation");
            root.appendChild(buildViewMode());
        }
    }
    render();

    container.appendChild(root);
    return root;
}
