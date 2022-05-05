import { NumberChar } from "../math-char/operand-chars";
import DecimalPoint from "../math-char/operand-chars/DecimalPoint";
import NumberSymbol from "./NumberSymbol";

export default class DecimalSymbol extends NumberSymbol<DecimalPoint> {
  private _integers: NumberChar[];
  private _decimals: NumberChar[];

  constructor(
    integers: NumberChar[],
    decimalPoint: DecimalPoint,
    decimals: NumberChar[]
  ) {
    super(decimalPoint);
    this._integers = integers;
    this._decimals = decimals;
  }

  renderLatex(): string {
    return (
      this._integers.map<string>(this._renderClickableLatex).join("") +
      this._renderClickableLatex(this._char as DecimalPoint) +
      this._decimals.map<string>(this._renderClickableLatex).join("")
    );
  }

  toString(): string {
    return (
      this._integers.map<string>((char) => char.toString()).join("") +
      "." +
      this._decimals.map<string>((char) => char.toString()).join("")
    );
  }
}
