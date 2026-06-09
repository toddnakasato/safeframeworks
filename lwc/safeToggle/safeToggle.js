/**
 * safeToggle — LWC toggle component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeToggle extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }

  get disabled() {
    return this.getMetadata('disabled');
  }

  get labelPosition() {
    return this.getMetadata('labelPosition');
  }
}
