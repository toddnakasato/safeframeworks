/**
 * safeTreemap — LWC treemap component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeTreemap extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
}
