export default class MathSymbol {
  protected _value: string;
  protected _paramsNumber = 0;

  constructor(value: string | number) {
    this._value = value.toString();
  }

  get paramsNumber(): number {
    return this._paramsNumber;
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
