/**
 * safeCallout — LWC callout component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeCallout extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }

  get position() {
    return this.getMetadata('position');
  }
}
