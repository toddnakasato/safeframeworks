import SafeContract from 'c/safeContract';

export default class SafeHierarchy extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
}
