import { LatexDefaultRenderer, MMLDefaultRenderer } from "../renderer";

export default class MathChar {
  private static _SEQUENCE_NUMBER = 0;
  readonly latexRenderer: typeof LatexDefaultRenderer = LatexDefaultRenderer;

  readonly mmlRenderer: typeof MMLDefaultRenderer = MMLDefaultRenderer;
  readonly clickableDataKey = "data-formular-char-sn";
  protected _mmlValueTemplate: string | undefined;

  private _sequenceNumber: number;
  protected _value: string;
  protected _paramsNumber = 0;
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

  get mmlValueTemplate(): string {
    return this._mmlValueTemplate == undefined
      ? this._value
      : this._mmlValueTemplate;
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
