import { NumberChar } from "../operand-chars";
import DecimalPoint from "../operand-chars/DecimalPoint";
import OperandSymbol from "./OperandSymbol";

export default class DecimalSymbol extends OperandSymbol<DecimalPoint> {
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
      this._integers.map<string>((char) => char.value).join("") +
      "." +
      this._decimals.map<string>((char) => char.value).join("")
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
