/**
 * safeLayout — LWC layout component.
 * Implements layout contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeLayout extends LightningElement {
  /** @type {import('safecontracts').ConfigBase} */
  @api config;

  /** @type {import('safecontracts').OnSafeEvent} */
  @api onEvent;

  /** @returns {string} data-variant attribute value */
  get variant() {
    return this.config?.metadata?.variant;
  }
}
