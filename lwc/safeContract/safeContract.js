/**
 * safeContract — LWC base class implementing safecontracts ConfigBase.
 * All safe* components extend this. Provides @api config, metadata access,
 * and runtime validation against DATA_FIELDS.
 */
import { LightningElement, api } from 'lwc';

/** DATA_FIELDS per component — mirrors safecontracts *_DATA_FIELDS arrays. */
export const COMPONENT_DATA_FIELDS = {
  "layout": ["variant"],
  "columns": ["spacing", "radius", "surface"],
  "card": ["variant", "surface", "spacing", "radius", "density"],
  "button": ["variant", "size", "disabled", "loading", "fullWidth", "iconOnly", "selected", "status", "groupVariant", "groupDirection"],
  "table": ["variant", "spacing", "headerStyle", "rowDivider", "rowNumbers", "truncate", "columnLines", "headerDivider", "zebra", "selectable"],
  "tree": ["variant", "spacing"],
  "list": ["variant", "direction", "selectionMode"],
  "sheet": ["variant", "spacing", "surface"],
  "chart": ["variant", "chartType"],
  "heatmap": ["variant"],
  "gauge": ["variant"],
  "funnel": ["variant"],
  "flow": ["variant"],
  "hierarchy": ["variant"],
  "timeline": ["variant"],
  "map": ["variant"],
  "calendar": ["variant", "size"],
  "toggle": ["variant", "disabled", "labelPosition"],
  "week": ["variant"],
  "tabs": ["variant", "position"],
  "callout": ["variant", "position"],
  "drag-drop": ["variant"],
  "grid": ["spacing", "radius", "surface", "collapsible"],
  "input": ["inputType", "align", "valign"],
  "picker": ["variant"],
  "nav": ["navStyle"]
};

/** Component registry — mirrors safecontracts COMPONENT_REGISTRY. */
export const COMPONENT_REGISTRY = [
  "layout", "columns", "card", "button", "table", "tree", "sheet", "chart", "heatmap", "gauge", "funnel", "flow", "hierarchy", "timeline", "map", "calendar", "toggle", "week", "chat", "tabs", "callout", "drag-drop", "grid", "input", "picker", "nav", "list"
];

export default class SafeContract extends LightningElement {
  /** @type {Object} ConfigBase — { component, metadata, data?, eventHandler?, children? } */
  @api config = {};

  /** @type {Function} Event callback */
  @api onEvent;

  /** Read a metadata field with optional default. */
  getMetadata(key, defaultValue) {
    return this.config?.metadata?.[key] ?? defaultValue;
  }

  /** Get the component type from config. */
  get componentType() {
    return this.config?.component;
  }

  /** Get the full metadata object. */
  get metadata() {
    return this.config?.metadata ?? {};
  }

  /** Get the DATA_FIELDS for this component type. */
  get dataFields() {
    return COMPONENT_DATA_FIELDS[this.componentType] ?? [];
  }

  /** Validate that all DATA_FIELDS are present in metadata. Returns failures array. */
  validate() {
    const fields = this.dataFields;
    const meta = this.metadata;
    const failures = [];
    for (const field of fields) {
      if (meta[field] === undefined) {
        failures.push({ field, error: 'missing from metadata' });
      }
    }
    return failures;
  }
}
