/**
 * safeButton — LWC button component.
 * Implements button contract from safecontracts (ConfigBase).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { LightningElement, api } from 'lwc';

export default class SafeButton extends LightningElement {
  /** @type {import('safecontracts').ConfigBase} */
  @api config;

  /** @type {import('safecontracts').OnSafeEvent} */
  @api onEvent;

  /** @returns {string} data-variant attribute value */
  get variant() {
    return this.config?.metadata?.variant;
  }

  /** @returns {string} data-size attribute value */
  get size() {
    return this.config?.metadata?.size;
  }

  /** @returns {string} data-disabled attribute value */
  get disabled() {
    return this.config?.metadata?.disabled;
  }

  /** @returns {string} data-loading attribute value */
  get loading() {
    return this.config?.metadata?.loading;
  }

  /** @returns {string} data-full-width attribute value */
  get fullWidth() {
    return this.config?.metadata?.fullWidth;
  }

  /** @returns {string} data-icon-only attribute value */
  get iconOnly() {
    return this.config?.metadata?.iconOnly;
  }

  /** @returns {string} data-selected attribute value */
  get selected() {
    return this.config?.metadata?.selected;
  }

  /** @returns {string} data-status attribute value */
  get status() {
    return this.config?.metadata?.status;
  }

  /** @returns {string} data-group-variant attribute value */
  get groupVariant() {
    return this.config?.metadata?.groupVariant;
  }

  /** @returns {string} data-group-direction attribute value */
  get groupDirection() {
    return this.config?.metadata?.groupDirection;
  }

  get label() {
    return this.config?.metadata?.label;
  }
}
