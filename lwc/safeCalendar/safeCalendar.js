/**
 * safeCalendar — LWC calendar component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeCalendar extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }

  get size() {
    return this.getMetadata('size');
  }
}
