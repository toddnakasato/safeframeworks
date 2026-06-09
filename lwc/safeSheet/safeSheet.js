/**
 * safeSheet — LWC sheet component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeSheet extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }

  get spacing() {
    return this.getMetadata('spacing');
  }

  get surface() {
    return this.getMetadata('surface');
  }
}
