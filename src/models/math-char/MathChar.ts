export default class MathChar {
  private static _SEQUENCE_NUMBER = 0;

  private _sequenceNumber: number;
  protected _value: string;
  protected _paramsNumber = 0;
  /* `_paramsParen` = n, if each ith param should be in parentheses and n & i = 1,
  and jth param should NOT be in parentheses and n & j = 0 */
  protected _paramsParen = 0;
  protected _clickable = false;

  constructor(value: string, sn = 0) {
    this._value = value;
    this._sequenceNumber = sn || ++MathChar._SEQUENCE_NUMBER;
  }

  get sequenceNumber(): number {
    return this._sequenceNumber;
  }

  get paramsNumber(): number {
    return this._paramsNumber;
  }

  get value(): string {
    return this._value;
  }

  get clickable(): boolean {
    return this._clickable;
  }

  /**
   * Check if the `i`th param should be in parentheses.
   *
   * @param i the position of the param. Be careful: `i` is from 0 (NOT 1).
   * @returns true if the `i`th param should be in parentheses.
   */
  hasParamParen(i: number): boolean {
    return !!((1 << i) & this._paramsParen);
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
