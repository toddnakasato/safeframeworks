/**
 * safeColumns — LWC columns component.
 * Implements columns contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeColumns extends LightningElement {
  /** @type {import('safecontracts').ConfigBase} */
  @api config;

  /** @type {import('safecontracts').OnSafeEvent} */
  @api onEvent;

  /** @returns {string} data-spacing attribute value */
  get spacing() {
    return this.config?.metadata?.spacing;
  }

  /** @returns {string} data-radius attribute value */
  get radius() {
    return this.config?.metadata?.radius;
  }

  /** @returns {string} data-surface attribute value */
  get surface() {
    return this.config?.metadata?.surface;
  }
}
