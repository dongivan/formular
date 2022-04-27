export default class MathSymbol {
  protected _value: string;
  protected _hasParams = false;

  constructor(value: string | number) {
    this._value = value.toString();
  }

  get hasParams(): boolean {
    return this._hasParams;
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
