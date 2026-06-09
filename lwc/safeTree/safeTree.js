/**
 * safeTree — LWC tree component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeTree extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }

  get spacing() {
    return this.getMetadata('spacing');
  }
}
