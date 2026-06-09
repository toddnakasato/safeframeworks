/**
 * safePicker — LWC picker component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafePicker extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
}
