/**
 * safeGrid — LWC grid component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeGrid extends SafeContract {
  get spacing() {
    return this.getMetadata('spacing');
  }

  get radius() {
    return this.getMetadata('radius');
  }

  get surface() {
    return this.getMetadata('surface');
  }

  get collapsible() {
    return this.getMetadata('collapsible');
  }
}
