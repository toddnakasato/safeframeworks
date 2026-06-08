/**
 * safeSheet — LWC sheet component.
 * Implements sheet contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeSheet extends LightningElement {
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

  /** @returns {string} data-surface attribute value */
  get surface() {
    return this.config?.metadata?.surface;
  }
}
