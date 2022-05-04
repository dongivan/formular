export default class MathChar {
  private static _SEQUENCE_NUMBER = 0;

  private _sequenceNumber: number;
  protected _value: string;
  protected _paramsNumber = 0;
  protected _latexTemplate: string | undefined;
  protected _clickable = false;

  constructor(value: string | number) {
    this._value = value.toString();
    this._sequenceNumber = ++MathChar._SEQUENCE_NUMBER;
  }

  get sequenceNumber(): number {
    return this._sequenceNumber;
  }

  get paramsNumber(): number {
    return this._paramsNumber;
  }

  get latexTemplate(): string {
    return this._latexTemplate == undefined ? this._value : this._latexTemplate;
  }

  get value(): string {
    return this._value;
  }

  get clickable(): boolean {
    return this._clickable;
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
}
