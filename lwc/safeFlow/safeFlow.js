import SafeContract from 'c/safeContract';

export default class SafeFlow extends SafeContract {
  get variant() {
    return this.getMetadata('variant');
  }
}
