/**
 * safeTreemap — LWC treemap component.
 * Implements treemap contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeTreemap extends LightningElement {
  /** @type {import('safecontracts').ConfigBase} */
  @api config;

  /** @type {import('safecontracts').OnSafeEvent} */
  @api onEvent;

  /** @returns {string} data-variant attribute value */
  get variant() {
    return this.config?.metadata?.variant;
  }
}
