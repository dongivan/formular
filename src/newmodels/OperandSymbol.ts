export default class OperandSymbol {
  private _value: string;

  constructor(value: string) {
    this._value = value;
  }

  toLatex(): string {
    return this._value;
  }
}
