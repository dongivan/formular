import { Latex, MathML } from "../renderer";

@Latex.RenderChar(({ char }) => char.value)
@Latex.RenderNode(
  ({ current, left, right }) => `${left || ""}${current}${right || ""}`
)
@MathML.RenderChar(({ char, h }) => [h("mtext", { value: char.value })])
@MathML.RenderNode(({ current, left, right }) => [
  ...(left || []),
  ...current,
  ...(right || []),
])
export default class MathChar {
  private static _SEQUENCE_NUMBER = 0;

  private _sequenceNumber: number;
  protected _value: string;
  protected _paramsNumber = 0;
  /* `_paramsParen` = n, if each ith param should be in parentheses and n & i = 1,
  and jth param should NOT be in parentheses and n & j = 0 */
  protected _paramsParen = 0;
  protected _interactive = false;

  constructor(
    args?:
      | {
          value?: string;
          sequenceNumber?: number;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [key: string]: any;
        }
      | string
  ) {
    if (typeof args == "undefined") {
      throw new Error("Create `MathChar` instance failed: miss args.");
    } else if (typeof args == "string") {
      this._value = args;
      this._sequenceNumber = ++MathChar._SEQUENCE_NUMBER;
    } else {
      this._value = args.value || "";
      this._sequenceNumber = args.sequenceNumber || ++MathChar._SEQUENCE_NUMBER;
    }
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

  get interactive(): boolean {
    return this._interactive;
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
