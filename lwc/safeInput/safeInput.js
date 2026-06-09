/**
 * safeInput — LWC input component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeInput extends SafeContract {
  get inputType() {
    return this.getMetadata('inputType');
  }

  get align() {
    return this.getMetadata('align');
  }

  get valign() {
    return this.getMetadata('valign');
  }
}
