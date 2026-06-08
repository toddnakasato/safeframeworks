/**
 * safeCard — LWC card component.
 * Implements card contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeCard extends LightningElement {
  /** @type {import('safecontracts').ConfigBase} */
  @api config;

  /** @type {import('safecontracts').OnSafeEvent} */
  @api onEvent;

  /** @returns {string} data-variant attribute value */
  get variant() {
    return this.config?.metadata?.variant;
  }

  /** @returns {string} data-surface attribute value */
  get surface() {
    return this.config?.metadata?.surface;
  }

  /** @returns {string} data-spacing attribute value */
  get spacing() {
    return this.config?.metadata?.spacing;
  }

  /** @returns {string} data-radius attribute value */
  get radius() {
    return this.config?.metadata?.radius;
  }

  /** @returns {string} data-density attribute value */
  get density() {
    return this.config?.metadata?.density;
  }

  get header() {
    return this.config?.metadata?.header;
  }
}
