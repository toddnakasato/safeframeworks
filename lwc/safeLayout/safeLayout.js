/**
 * safeLayout — LWC layout component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeLayout extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
}
