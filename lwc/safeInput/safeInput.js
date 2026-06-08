/**
 * safeInput — LWC input component.
 * Implements input contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeInput extends LightningElement {
  /** @type {import('safecontracts').ConfigBase} */
  @api config;

  /** @type {import('safecontracts').OnSafeEvent} */
  @api onEvent;

  /** @returns {string} data-input-type attribute value */
  get inputType() {
    return this.config?.metadata?.inputType;
  }

  /** @returns {string} data-align attribute value */
  get align() {
    return this.config?.metadata?.align;
  }

  /** @returns {string} data-valign attribute value */
  get valign() {
    return this.config?.metadata?.valign;
  }
}
