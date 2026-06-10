import SafeContract from 'c/safeContract';

export default class SafeList extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
  get direction() {
    return this.getMetadata('direction');
  }
  get selectionMode() {
    return this.getMetadata('selectionMode');
  }
}
