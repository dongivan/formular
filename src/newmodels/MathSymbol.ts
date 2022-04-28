export default class MathSymbol {
  protected _value: string;
  protected _paramsNumber = 0;
  protected _latexTemplate: string | undefined;

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

  renderLatex(params?: string[]): string {
    let result = this._latexTemplate || this._value;
    if (params) {
      for (let i = 0; i < this._paramsNumber; i++) {
        result = result.replace(new RegExp(`<${i + 1}>`, "g"), params[i] || "");
      }
    }
    return result;
  }
}
