import { NumberChar } from "../operand-chars";
import OperandSymbol from "./OperandSymbol";

export default class NumberSymbol extends OperandSymbol<NumberChar> {
  private _integers: NumberChar[];

  constructor(integers: [NumberChar, ...NumberChar[]]) {
    super(integers[0]);
    this._integers = integers;
  }

  renderLatex(): string {
    return this._integers.map<string>((number) => number.toString()).join("");
  }

  toString(): string {
    return this._integers.map<string>((number) => number.toString()).join("");
  }
}
