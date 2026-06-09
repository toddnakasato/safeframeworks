/**
 * safeChat — LWC chat component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeChat extends SafeContract {
  get title() {
    return this.getMetadata('title');
  }
}
