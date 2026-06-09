/**
 * safeColumns — LWC columns component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeColumns extends SafeContract {
  get spacing() {
    return this.getMetadata('spacing');
  }

  get radius() {
    return this.getMetadata('radius');
  }

  get surface() {
    return this.getMetadata('surface');
  }
}
