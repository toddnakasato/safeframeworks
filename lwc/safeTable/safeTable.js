/**
 * safeTable — LWC table component.
 * Extends SafeContract (ConfigBase). Outputs data-* attributes for intent.
 */
import SafeContract from 'c/safeContract';

export default class SafeTable extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }

  get spacing() {
    return this.getMetadata('spacing');
  }

  get headerStyle() {
    return this.getMetadata('headerStyle');
  }

  get rowDivider() {
    return this.getMetadata('rowDivider');
  }

  get rowNumbers() {
    return this.getMetadata('rowNumbers');
  }

  get truncate() {
    return this.getMetadata('truncate');
  }

  get columnLines() {
    return this.getMetadata('columnLines');
  }

  get headerDivider() {
    return this.getMetadata('headerDivider');
  }

  get zebra() {
    return this.getMetadata('zebra');
  }

  get selectable() {
    return this.getMetadata('selectable');
  }
}
