/**
 * safeFunnel — LWC funnel component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeFunnel extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
}
