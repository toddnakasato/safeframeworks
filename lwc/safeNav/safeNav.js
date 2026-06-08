/**
 * safeNav — LWC nav component.
 * Implements nav contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeNav extends LightningElement {
  /** @type {import('safecontracts').ConfigBase} */
  @api config;

  /** @type {import('safecontracts').OnSafeEvent} */
  @api onEvent;

  /** @returns {string} data-nav-style attribute value */
  get navStyle() {
    return this.config?.metadata?.navStyle;
  }
}
