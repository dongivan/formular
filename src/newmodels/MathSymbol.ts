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

  toJSON(): {
    type: string;
    value: string;
  } {
    return {
      type: this.constructor.name,
      value: this.toString(),
    };
  }

  renderLatex(params?: string[]): string {
    let result =
      this._latexTemplate == undefined ? this._value : this._latexTemplate;
    if (params) {
      for (let i = 0; i < this._paramsNumber; i++) {
        result = result.replace(new RegExp(`<${i + 1}>`, "g"), params[i] || "");
      }
    }
    return result;
  }
}
