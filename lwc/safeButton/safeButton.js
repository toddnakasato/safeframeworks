/**
 * safeButton — LWC button component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeButton extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }

  get size() {
    return this.getMetadata('size');
  }

  get disabled() {
    return this.getMetadata('disabled');
  }

  get loading() {
    return this.getMetadata('loading');
  }

  get fullWidth() {
    return this.getMetadata('fullWidth');
  }

  get iconOnly() {
    return this.getMetadata('iconOnly');
  }

  get selected() {
    return this.getMetadata('selected');
  }

  get status() {
    return this.getMetadata('status');
  }

  get groupVariant() {
    return this.getMetadata('groupVariant');
  }

  get groupDirection() {
    return this.getMetadata('groupDirection');
  }

  get label() {
    return this.getMetadata('label');
  }
}
