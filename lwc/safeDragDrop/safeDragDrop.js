/**
 * safeDragDrop — LWC drag-drop component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeDragDrop extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
}
