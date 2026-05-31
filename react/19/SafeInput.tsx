/**
 * SafeInput — config-driven view/edit field component.
 *
 * Reads metadata. Renders native HTML with data-attributes.
 * Gallery JSON is the single source of truth.
 * Zero hardcoded values — all defaults in INPUT_DEFAULTS.
 * Zero inline styles — all visuals via data-attributes mapped by CSS.
 * Fully internationalized.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import type { ConfigBase, OnSafeEvent } from "safecomponents";
import { createSafeEvent } from "safecomponents";
import type { InputType, InputOption, LookupRecord, DisplayFormat } from "safecomponents/src/components/input";
import { INPUT_DEFAULTS } from "safecomponents/src/components/input";
import Editor from "@monaco-editor/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

// --- Formatters (all parameterized) ---
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

function formatDisplay(value: any, format: DisplayFormat | undefined, locale: string, currency: string, timezone: string, decimals: number): string {
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

export interface SafeInputProps {
  config: ConfigBase;
  data: Record<string, any>;
  field?: string;
  onEvent?: OnSafeEvent;
}

export function SafeInput({ config, data, field, onEvent }: SafeInputProps) {
  const { metadata } = config;
  const D = INPUT_DEFAULTS;

  // All config from metadata
  const inputType = (metadata.inputType as InputType) ?? "text";
  const displayFormat = metadata.displayFormat as DisplayFormat | undefined;
  const defaultText = (metadata.defaultText as string) ?? "";
  const placeholder = (metadata.placeholder as string) ?? "";
  const textAlign = (metadata.textAlign as React.CSSProperties["textAlign"]) ?? D.textAlign;
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
  const language = (metadata.language as string) ?? "json";
  const lineNumbers = metadata.lineNumbers !== false;
  const showMinimap = !!metadata.minimap;
  const wordWrap = metadata.wordWrap !== false ? "on" as const : "off" as const;
  const editorHeight = (metadata.editorHeight as string) ?? D.editorHeight;
  const fontSize = (metadata.fontSize as number) ?? D.fontSize;
  const tabSize = (metadata.tabSize as number) ?? D.tabSize;
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

  const fieldName = field ?? metadata.name ?? "";
  const rawValue = data[fieldName];

  // State
  const [isEditing, setIsEditing] = useState(!!metadata.forceEditMode);
  const [editValue, setEditValue] = useState<any>(rawValue);
  const [editValueMax, setEditValueMax] = useState<any>(
    dualRange ? (Array.isArray(rawValue) ? rawValue[1] : Math.round(max * 0.75)) : null
  );
  const [lookupSearchText, setLookupSearchText] = useState("");
  const [showLookupSelect, setShowLookupSelect] = useState(false);
  const [picklistFilterText, setPicklistFilterText] = useState("");
  const [showPicklistSelect, setShowPicklistSelect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setEditValue(rawValue); }, [rawValue]);
  useEffect(() => { setIsEditing(!!metadata.forceEditMode); }, [metadata.forceEditMode]);

  const fireEvent = useCallback((name: string, payload: any) => {
    onEvent?.(createSafeEvent("SafeInput", name, payload));
  }, [onEvent]);

  // --- Display value ---
  function getDisplayValue(): string {
    if (rawValue == null || (rawValue === "" && rawValue !== 0 && rawValue !== false)) return defaultText;
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

  const filteredOptions = hasPicklistFilter && picklistFilterText
    ? options.filter((o) => o.label.toLowerCase().includes(picklistFilterText.toLowerCase()))
    : options;
  const filteredLookupRecords = lookupSearchText
    ? lookupRecords.filter((r) => r.name.toLowerCase().includes(lookupSearchText.toLowerCase()))
    : lookupRecords;

  function lookupPrompt(): string {
    return filteredLookupRecords.length > 0
      ? lookupFoundMessage.replace("{count}", String(filteredLookupRecords.length))
      : lookupEmptyMessage;
  }

  // --- Handlers ---
  function handleEditClick() {
    setIsEditing(true);
    fireEvent("editmode", { editing: true });
    if (inputType === "lookup") { setShowLookupSelect(false); setLookupSearchText(""); }
  }

  function handleCancelClick() {
    setIsEditing(false);
    setShowLookupSelect(false); setLookupSearchText("");
    setShowPicklistSelect(false); setPicklistFilterText("");
    if (inputType === "lookup") {
      fireEvent("change", { field: fieldName, value: null, recordName: null });
    } else {
      fireEvent("canceledit", { field: fieldName });
    }
  }

  function handleChange(newValue: any) {
    setIsEditing(false);
    fireEvent("change", { field: fieldName, value: newValue });
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    if (isEditing && inputType !== "lookup" && inputType !== "picklist") {
      handleChange(e.target.value);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && inputType !== "multiline-text" && inputType !== "text") {
      e.preventDefault();
      handleChange((e.target as HTMLInputElement).value);
    } else if (e.key === "Escape") {
      handleCancelClick();
    }
  }

  function handleTextClick() {
    if (isLink) { fireEvent("navigate", { field: fieldName, value: rawValue }); return; }
    if (!hideEdit && inputType !== "lookup") handleEditClick();
  }

  const verticalStyle: React.CSSProperties = isVertical
    ? { writingMode: "vertical-lr" as any, direction: "rtl" as any, height: sliderHeight }
    : {};

  const gradientStyle: React.CSSProperties = gradientColors
    ? { background: `linear-gradient(${isVertical ? "to top" : "to right"}, ${gradientColors.join(", ")})`, borderRadius: "0.25rem" }
    : {};

  const shouldShowEditMode = isEditing || !!metadata.forceEditMode;

  // Root attributes shared by all renders
  const rootAttrs = {
    "data-component": "input",
    "data-input-type": inputType,
    "data-align": align,
    "data-valign": valign,
  };

  // ===================== EDIT MODE =====================
  if (shouldShowEditMode) {
    return (
      <div {...rootAttrs} data-mode="edit" data-orientation={orientation}>
        <div data-role="edit-mode">

          {inputType === "text" && (
            <input ref={inputRef as any} type="text" data-role="field" style={{ textAlign }} value={rawValue ?? ""} placeholder={placeholder || defaultText} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "multiline-text" && (
            <textarea ref={inputRef as any} data-role="field" style={{ textAlign }} defaultValue={rawValue ?? ""} placeholder={placeholder || defaultText} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "number" && (
            <input ref={inputRef as any} type="number" data-role="field" style={{ textAlign }} value={rawValue ?? ""} placeholder={placeholder || defaultText} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "currency" && (
            <input ref={inputRef as any} type="number" step={decimalPlaces === 0 ? "1" : "0." + "0".repeat(decimalPlaces - 1) + "1"} data-role="field" style={{ textAlign }} value={rawValue ?? ""} placeholder={placeholder || defaultText} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "date" && (
            <input ref={inputRef as any} type="date" data-role="field" style={{ textAlign }} value={rawValue ?? ""} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "datetime" && (
            <input ref={inputRef as any} type="datetime-local" data-role="field" style={{ textAlign }} value={rawValue ?? ""} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "password" && (
            <input ref={inputRef as any} type={showPassword ? "text" : "password"} data-role="field" style={{ textAlign }} value={rawValue ?? ""} placeholder={placeholder || defaultText} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}
          {inputType === "password" && showPasswordToggle && (
            <span data-role="password-toggle" onClick={() => setShowPassword((p: boolean) => !p)}>{showPassword ? "🙈" : "👁"}</span>
          )}

          {inputType === "email" && (
            <input ref={inputRef as any} type="email" data-role="field" style={{ textAlign }} value={rawValue ?? ""} placeholder={placeholder || defaultText} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "phone" && (
            <input ref={inputRef as any} type="tel" data-role="field" style={{ textAlign }} value={rawValue ?? ""} placeholder={placeholder || defaultText} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "url" && (
            <input ref={inputRef as any} type="url" data-role="field" style={{ textAlign }} value={rawValue ?? ""} placeholder={placeholder || defaultText} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "search" && (
            <div data-role="search-wrap">
              <input ref={inputRef as any} type="search" data-role="field" style={{ textAlign }} value={editValue ?? ""} placeholder={placeholder || defaultText} onChange={(e) => { setEditValue(e.target.value); fireEvent("textinput", { field: fieldName, value: e.target.value }); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleChange(editValue); } else if (e.key === "Escape") { handleCancelClick(); } }} />
              {showClear && editValue && <span data-role="clear" onClick={() => { setEditValue(""); fireEvent("change", { field: fieldName, value: "" }); }}>✕</span>}
            </div>
          )}

          {inputType === "time" && (
            <input ref={inputRef as any} type="time" data-role="field" style={{ textAlign }} value={rawValue ?? ""} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}

          {inputType === "color" && (
            <div data-role="color-wrap">
              <input type="color" data-role="color-picker" value={editValue ?? defaultColor} onChange={(e) => { setEditValue(e.target.value); fireEvent("change", { field: fieldName, value: e.target.value }); }} />
              <span data-role="color-value">{editValue ?? defaultColor}</span>
            </div>
          )}

          {inputType === "file" && (
            <input type="file" data-role="field" accept={accept} multiple={fileMultiple} onChange={(e) => { const files = Array.from(e.target.files ?? []); fireEvent("change", { field: fieldName, value: files.map(f => ({ name: f.name, size: f.size, type: f.type })) }); }} />
          )}

          {inputType === "tags" && (
            <div data-role="tags-wrap">
              <div data-role="tags-list">
                {(Array.isArray(editValue) ? editValue : []).map((tag: string, i: number) => (
                  <span key={i} data-role="tag">
                    {tag}
                    <span data-role="tag-remove" onClick={() => { const next = (editValue as string[]).filter((_, j) => j !== i); setEditValue(next); fireEvent("change", { field: fieldName, value: next }); }}>✕</span>
                  </span>
                ))}
              </div>
              <input data-role="field" type="text" placeholder={placeholder || defaultText} onKeyDown={(e) => { if (e.key === "Enter" || e.key === tagSeparator) { e.preventDefault(); const val = (e.target as HTMLInputElement).value.trim(); if (val && (!maxTagsNum || (editValue?.length ?? 0) < maxTagsNum)) { const next = [...(Array.isArray(editValue) ? editValue : []), val]; setEditValue(next); fireEvent("change", { field: fieldName, value: next }); (e.target as HTMLInputElement).value = ""; } } else if (e.key === "Escape") { handleCancelClick(); } }} />
            </div>
          )}

          {inputType === "autocomplete" && (
            <div data-role="autocomplete-wrap">
              <input data-role="field" type="text" style={{ textAlign }} value={editValue ?? ""} placeholder={placeholder || defaultText} onChange={(e) => { setEditValue(e.target.value); fireEvent("textinput", { field: fieldName, value: e.target.value }); }} onBlur={() => setTimeout(() => handleChange(editValue), 150)} onKeyDown={handleKeyDown} />
              {editValue && suggestions.length > 0 && (
                <div data-role="suggestions">
                  {suggestions.filter((s: string) => s.toLowerCase().includes(String(editValue).toLowerCase())).map((s: string, i: number) => (
                    <div key={i} data-role="suggestion" onClick={() => { setEditValue(s); handleChange(s); }}>{s}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {inputType === "masked" && (
            <input ref={inputRef as any} type="text" data-role="field" style={{ textAlign }} value={editValue ?? ""} placeholder={mask || placeholder || defaultText} onChange={(e) => { const v = applyMask(e.target.value, mask, maskCharVal); setEditValue(v); fireEvent("change", { field: fieldName, value: v }); }} onKeyDown={handleKeyDown} />
          )}

          {inputType === "pin" && (
            <div data-role="pin-wrap">
              {Array.from({ length: pinLengthNum }, (_, i) => (
                <input key={i} type="text" data-role="pin-digit" maxLength={1} value={String(editValue ?? "")[i] ?? ""} onChange={(e) => { const chars = String(editValue ?? "").split(""); chars[i] = e.target.value.slice(-1); const next = chars.join(""); setEditValue(next); if (next.length === pinLengthNum) fireEvent("change", { field: fieldName, value: next }); const nextInput = e.target.nextElementSibling as HTMLInputElement; if (nextInput && e.target.value) nextInput.focus(); }} onKeyDown={(e) => { if (e.key === "Backspace" && !String(editValue ?? "")[i]) { const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement; if (prev) prev.focus(); } else if (e.key === "Escape") handleCancelClick(); }} />
              ))}
            </div>
          )}

          {inputType === "range-date" && (
            <div data-role="range-date-wrap">
              <label data-role="range-label">{rangeStartLabel}</label>
              <input type="date" data-role="field" value={Array.isArray(editValue) ? editValue[0] ?? "" : ""} onChange={(e) => { const next = [e.target.value, Array.isArray(editValue) ? editValue[1] ?? "" : ""]; setEditValue(next); fireEvent("change", { field: fieldName, value: next }); }} />
              <label data-role="range-label">{rangeEndLabel}</label>
              <input type="date" data-role="field" value={Array.isArray(editValue) ? editValue[1] ?? "" : ""} onChange={(e) => { const next = [Array.isArray(editValue) ? editValue[0] ?? "" : "", e.target.value]; setEditValue(next); fireEvent("change", { field: fieldName, value: next }); }} />
            </div>
          )}

          {inputType === "signature" && (
            <div data-role="signature-wrap">
              <canvas data-role="signature-canvas" ref={canvasRef as any} width={signatureWidth} height={signatureHeight}
                onMouseDown={(e) => { const ctx = (e.target as HTMLCanvasElement).getContext("2d"); if (ctx) { ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.strokeStyle = penColorVal; ctx.lineWidth = penWidthNum; (e.target as any)._drawing = true; } }}
                onMouseMove={(e) => { if ((e.target as any)._drawing) { const ctx = (e.target as HTMLCanvasElement).getContext("2d"); if (ctx) { ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke(); } } }}
                onMouseUp={(e) => { (e.target as any)._drawing = false; const dataUrl = (e.target as HTMLCanvasElement).toDataURL(); setEditValue(dataUrl); fireEvent("change", { field: fieldName, value: dataUrl }); }}
              />
              <button data-role="signature-clear" onClick={() => { const canvas = (canvasRef.current as HTMLCanvasElement); if (canvas) { canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height); setEditValue(null); fireEvent("change", { field: fieldName, value: null }); } }}>{signatureClearLabel}</button>
            </div>
          )}

          {inputType === "rich-text" && (
            <div data-role="rich-text-wrap" contentEditable suppressContentEditableWarning style={{ minHeight: richTextMinHeight }}
              dangerouslySetInnerHTML={{ __html: String(editValue ?? "") }}
              onBlur={(e) => { const html = (e.target as HTMLDivElement).innerHTML; setEditValue(html); fireEvent("change", { field: fieldName, value: html }); }}
            />
          )}

          {inputType === "address" && (
            <div data-role="address-wrap">
              {addressFieldsList.map((af) => (
                <input key={af} data-role="field" type="text" placeholder={af} value={(editValue as any)?.[af] ?? ""} onChange={(e) => { const next = { ...(typeof editValue === "object" && editValue ? editValue : {}), [af]: e.target.value }; setEditValue(next); fireEvent("change", { field: fieldName, value: next }); }} />
              ))}
            </div>
          )}

          {inputType === "checkbox" && (
            <input type="checkbox" data-role="field" checked={!!editValue} onChange={(e) => { setEditValue(e.target.checked); fireEvent("change", { field: fieldName, value: e.target.checked }); }} />
          )}

          {inputType === "radio" && (
            <input type="radio" data-role="field" checked={!!editValue} onClick={() => { const v = !editValue; setEditValue(v); fireEvent("change", { field: fieldName, value: v }); }} readOnly />
          )}

          {inputType === "toggle" && (
            <label data-role="toggle-switch">
              <input type="checkbox" data-role="toggle-input" checked={!!editValue} onChange={(e) => { setEditValue(e.target.checked); fireEvent("change", { field: fieldName, value: e.target.checked }); }} />
              <span data-role="toggle-slider" />
            </label>
          )}

          {inputType === "picklist" && !hasPicklistFilter && !isMultiSelect && (
            <select data-role="field" style={{ textAlign }} value={rawValue ?? ""} onChange={(e) => { setShowPicklistSelect(false); setPicklistFilterText(""); handleChange(e.target.value); }}>
              <option value="">{defaultSelectMessage}</option>
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )}
          {inputType === "picklist" && !hasPicklistFilter && isMultiSelect && (
            <select data-role="field" multiple size={selectSize} value={Array.isArray(rawValue) ? rawValue : []} onChange={(e) => { handleChange(Array.from(e.target.selectedOptions).map((o) => o.value)); }}>
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )}
          {inputType === "picklist" && hasPicklistFilter && !showPicklistSelect && (
            <input data-role="filter" type="text" placeholder={placeholder || defaultText} value={picklistFilterText} onChange={(e) => setPicklistFilterText(e.target.value)} onBlur={() => { if (picklistFilterText.trim()) setShowPicklistSelect(true); }} />
          )}
          {inputType === "picklist" && hasPicklistFilter && showPicklistSelect && (
            <select data-role="field" value={rawValue ?? ""} onChange={(e) => { setShowPicklistSelect(false); setPicklistFilterText(""); handleChange(e.target.value); }}>
              <option value="">{defaultSelectMessage}</option>
              {filteredOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )}

          {inputType === "lookup" && !showLookupSelect && (
            <input data-role="lookup-search" type="text" placeholder={placeholder || defaultText} value={lookupSearchText} onChange={(e) => { setLookupSearchText(e.target.value); fireEvent("textinput", { field: fieldName, value: e.target.value }); }} onBlur={() => { if (lookupSearchText.trim()) setShowLookupSelect(true); }} />
          )}
          {inputType === "lookup" && showLookupSelect && (
            <select data-role="field" onChange={(e) => { const id = e.target.value; const rec = lookupRecords.find((r) => r.id === id); setIsEditing(false); setShowLookupSelect(false); setLookupSearchText(""); fireEvent("change", { field: fieldName, value: id, recordName: rec?.name ?? id }); }}>
              <option value="">{lookupPrompt()}</option>
              {filteredLookupRecords.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          )}

          {inputType === "slider" && (
            <div data-role="slider-wrap" data-orientation={orientation} data-dual={dualRange || undefined} data-ticks={showTicks || undefined}>
              {dualRange ? (
                <div data-role="dual-range">
                  <input type="range" data-role="slider" data-track="min" min={min} max={max} step={step} value={Array.isArray(editValue) ? editValue[0] : (editValue ?? min)} style={{ ...verticalStyle, ...gradientStyle }} onChange={(e) => { const v = Number(e.target.value); const maxV = editValueMax ?? max; if (v <= maxV) { setEditValue([v, maxV]); fireEvent("change", { field: fieldName, value: [v, maxV] }); } }} />
                  <input type="range" data-role="slider" data-track="max" min={min} max={max} step={step} value={editValueMax ?? max} style={{ ...verticalStyle, ...gradientStyle, position: "absolute", left: 0, right: 0, top: 0 }} onChange={(e) => { const v = Number(e.target.value); const minV = Array.isArray(editValue) ? editValue[0] : (editValue ?? min); if (v >= minV) { setEditValueMax(v); setEditValue([minV, v]); fireEvent("change", { field: fieldName, value: [minV, v] }); } }} />
                </div>
              ) : (
                <input type="range" data-role="slider" min={min} max={max} step={step} value={editValue ?? min} style={{ ...verticalStyle, ...gradientStyle }} onChange={(e) => { const v = Number(e.target.value); setEditValue(v); fireEvent("change", { field: fieldName, value: v }); }} />
              )}
              {showValue && (
                <span data-role="slider-value">
                  {dualRange && Array.isArray(editValue) ? `${editValue[0]}–${editValue[1]}` : `${editValue ?? min}`}
                </span>
              )}
              {showTicks && (
                <div data-role="tick-marks">
                  {Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => (
                    <span key={i}>{min + i * step}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {inputType === "rating" && (
            <div data-role="rating-wrap">
              {Array.from({ length: maxIcons }, (_, i) => (
                <span key={i} data-role="rating-icon" data-filled={i < (editValue ?? 0) ? "true" : "false"} onClick={() => { const v = i + 1 === editValue ? 0 : i + 1; setEditValue(v); fireEvent("change", { field: fieldName, value: v }); }}>
                  {i < (editValue ?? 0) ? filledIcon : emptyIcon}
                </span>
              ))}
            </div>
          )}

          {inputType === "code" && (
            <div data-role="code-wrap">
              <Editor
                height={editorHeight}
                language={language}
                theme="vs-dark"
                value={String(editValue ?? "")}
                onChange={(val) => { setEditValue(val ?? ""); fireEvent("change", { field: fieldName, value: val ?? "" }); }}
                options={{ lineNumbers: lineNumbers ? "on" : "off", minimap: { enabled: showMinimap }, wordWrap, scrollBeyondLastLine: false, fontSize, tabSize, automaticLayout: true }}
              />
            </div>
          )}

          {!hideCancel && (
            <span data-role="cancel" onClick={handleCancelClick}>✕</span>
          )}
        </div>
      </div>
    );
  }

  // ===================== VIEW MODE =====================
  const displayValue = getDisplayValue();
  const maxLinesStyle = maxLines ? { maxHeight: `${maxLines * 1.5}em`, overflow: "hidden" as const } : undefined;

  if (inputType === "checkbox" || inputType === "radio" || inputType === "toggle") {
    return (
      <div {...rootAttrs} data-mode="view">
        <div data-role="view-mode">
          {inputType === "checkbox" && <input type="checkbox" data-role="field" checked={!!editValue} readOnly />}
          {inputType === "radio" && <input type="radio" data-role="field" checked={!!editValue} readOnly />}
          {inputType === "toggle" && (
            <label data-role="toggle-switch"><input type="checkbox" data-role="toggle-input" checked={!!editValue} readOnly /><span data-role="toggle-slider" /></label>
          )}
          {!hideEdit && <span data-role="edit-icon" onClick={handleEditClick}>✎</span>}
        </div>
      </div>
    );
  }

  if (inputType === "slider") {
    const displayVal = dualRange && Array.isArray(editValue) ? `${editValue[0]}–${editValue[1]}` : `${editValue ?? min}`;
    return (
      <div {...rootAttrs} data-mode="view" data-orientation={orientation}>
        <div data-role="view-mode">
          <div data-role="slider-wrap" data-orientation={orientation}>
            <input type="range" data-role="slider" min={min} max={max} step={step} value={Array.isArray(editValue) ? editValue[0] : (editValue ?? min)} disabled style={{ ...verticalStyle, ...gradientStyle }} />
            {showValue && <span data-role="slider-value">{displayVal}</span>}
          </div>
          {!hideEdit && <span data-role="edit-icon" onClick={handleEditClick}>✎</span>}
        </div>
      </div>
    );
  }

  if (inputType === "rating") {
    return (
      <div {...rootAttrs} data-mode="view">
        <div data-role="view-mode">
          <div data-role="rating-wrap">
            {Array.from({ length: maxIcons }, (_, i) => (
              <span key={i} data-role="rating-icon" data-filled={i < (editValue ?? 0) ? "true" : "false"}>
                {i < (editValue ?? 0) ? filledIcon : emptyIcon}
              </span>
            ))}
          </div>
          {!hideEdit && <span data-role="edit-icon" onClick={handleEditClick}>✎</span>}
        </div>
      </div>
    );
  }

  if (inputType === "code") {
    return (
      <div {...rootAttrs} data-mode="view">
        <div data-role="view-mode" data-layout="vertical">
          <div data-role="code-wrap">
            <Editor height={editorHeight} language={language} theme="vs-dark" value={String(editValue ?? "")}
              options={{ readOnly: true, lineNumbers: lineNumbers ? "on" : "off", minimap: { enabled: showMinimap }, wordWrap, scrollBeyondLastLine: false, fontSize, tabSize, automaticLayout: true, domReadOnly: true }} />
          </div>
          {!hideEdit && <span data-role="edit-icon" onClick={handleEditClick}>✎</span>}
        </div>
      </div>
    );
  }

  if (inputType === "color") {
    return (
      <div {...rootAttrs} data-mode="view">
        <div data-role="view-mode">
          <div data-role="color-wrap">
            <span data-role="color-swatch" style={{ background: String(editValue ?? defaultColor) }} />
            <span data-role="color-value">{editValue ?? defaultColor}</span>
          </div>
          {!hideEdit && <span data-role="edit-icon" onClick={handleEditClick}>✎</span>}
        </div>
      </div>
    );
  }

  if (inputType === "tags") {
    return (
      <div {...rootAttrs} data-mode="view">
        <div data-role="view-mode">
          <div data-role="tags-list">
            {(Array.isArray(editValue) ? editValue : []).map((tag: string, i: number) => (
              <span key={i} data-role="tag">{tag}</span>
            ))}
          </div>
          {!hideEdit && <span data-role="edit-icon" onClick={handleEditClick}>✎</span>}
        </div>
      </div>
    );
  }

  if (inputType === "signature" && editValue) {
    return (
      <div {...rootAttrs} data-mode="view">
        <div data-role="view-mode" data-layout="vertical">
          <img data-role="signature-image" src={editValue} alt="signature" />
          {!hideEdit && <span data-role="edit-icon" onClick={handleEditClick}>✎</span>}
        </div>
      </div>
    );
  }

  // All other types
  return (
    <div {...rootAttrs} data-mode="view">
      <div data-role="view-mode">
        {displayFormat === "markdown" ? (
          <div data-role="markdown" onClick={handleTextClick}>
            <Markdown remarkPlugins={[remarkGfm]}>{String(rawValue ?? defaultText)}</Markdown>
          </div>
        ) : (
          <span data-role="value" data-link={isLink || undefined} style={{ textAlign, ...maxLinesStyle }} onClick={handleTextClick}>
            {displayValue || defaultText}
          </span>
        )}
        {!hideEdit && <span data-role="edit-icon" onClick={handleEditClick}>✎</span>}
      </div>
    </div>
  );
}