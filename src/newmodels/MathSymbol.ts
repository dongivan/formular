export default class MathSymbol {
  protected _value: string;

  constructor(value: string | number) {
    this._value = value.toString();
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this.toString();
  }

  toLatex(): string {
    return this.toString();
  }
}
