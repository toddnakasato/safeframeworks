/**
 * safeGauge — LWC gauge component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeGauge extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
}
