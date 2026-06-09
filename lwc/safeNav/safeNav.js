/**
 * safeNav — LWC nav component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeNav extends SafeContract {
  get navStyle() {
    return this.getMetadata('navStyle');
  }
}
