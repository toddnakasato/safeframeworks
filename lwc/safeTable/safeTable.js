/**
 * safeTable — LWC table component.
 * Implements table contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeTable extends LightningElement {
  /** @type {import('safecontracts').ConfigBase} */
  @api config;

  /** @type {import('safecontracts').OnSafeEvent} */
  @api onEvent;

  /** @returns {string} data-variant attribute value */
  get variant() {
    return this.config?.metadata?.variant;
  }

  /** @returns {string} data-spacing attribute value */
  get spacing() {
    return this.config?.metadata?.spacing;
  }

  /** @returns {string} data-header-style attribute value */
  get headerStyle() {
    return this.config?.metadata?.headerStyle;
  }

  /** @returns {string} data-row-divider attribute value */
  get rowDivider() {
    return this.config?.metadata?.rowDivider;
  }

  /** @returns {string} data-row-numbers attribute value */
  get rowNumbers() {
    return this.config?.metadata?.rowNumbers;
  }

  /** @returns {string} data-truncate attribute value */
  get truncate() {
    return this.config?.metadata?.truncate;
  }

  /** @returns {string} data-column-lines attribute value */
  get columnLines() {
    return this.config?.metadata?.columnLines;
  }

  /** @returns {string} data-header-divider attribute value */
  get headerDivider() {
    return this.config?.metadata?.headerDivider;
  }

  /** @returns {string} data-zebra attribute value */
  get zebra() {
    return this.config?.metadata?.zebra;
  }

  /** @returns {string} data-selectable attribute value */
  get selectable() {
    return this.config?.metadata?.selectable;
  }
}
