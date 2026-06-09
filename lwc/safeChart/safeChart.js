/**
 * safeChart — LWC chart component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeChart extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }

  get chartType() {
    return this.getMetadata('chartType');
  }
}
