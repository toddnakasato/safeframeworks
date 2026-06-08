/**
 * safeToggle — LWC toggle component.
 * Implements toggle contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeToggle extends LightningElement {
  /** @type {import('safecontracts').ConfigBase} */
  @api config;

  /** @type {import('safecontracts').OnSafeEvent} */
  @api onEvent;

  /** @returns {string} data-variant attribute value */
  get variant() {
    return this.config?.metadata?.variant;
  }

  /** @returns {string} data-disabled attribute value */
  get disabled() {
    return this.config?.metadata?.disabled;
  }

  /** @returns {string} data-label-position attribute value */
  get labelPosition() {
    return this.config?.metadata?.labelPosition;
  }
}
