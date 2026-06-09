/**
 * safeCard — LWC card component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeCard extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }

  get surface() {
    return this.getMetadata('surface');
  }

  get spacing() {
    return this.getMetadata('spacing');
  }

  get radius() {
    return this.getMetadata('radius');
  }

  get density() {
    return this.getMetadata('density');
  }

  get header() {
    return this.getMetadata('header');
  }
}
