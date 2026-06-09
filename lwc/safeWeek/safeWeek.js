/**
 * safeWeek — LWC week component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeWeek extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
}
