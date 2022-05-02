export default class MathSymbol {
  private static _SEQUENCE_NUMBER = 0;

  private _sequenceNumber: number;
  protected _value: string;
  protected _paramsNumber = 0;
  protected _latexTemplate: string | undefined;
  protected _clickable = false;

  constructor(value: string | number) {
    this._value = value.toString();
    this._sequenceNumber = ++MathSymbol._SEQUENCE_NUMBER;
  }

  get sequenceNumber(): number {
    return this._sequenceNumber;
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
      for (let i = 0; i < params.length; i++) {
        result = result.replace(new RegExp(`<${i + 1}>`, "g"), params[i] || "");
      }
    }
    if (this._clickable) {
      result = `\\htmlData{formular-symbol-sn=${this._sequenceNumber}}{${result}}`;
    }
    return result;
  }
}
