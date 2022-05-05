import { NumberChar } from "../math-char/operand-chars";
import NumberSymbol from "./NumberSymbol";

export default class IntegerSymbol extends NumberSymbol<NumberChar> {
  private _integers: NumberChar[];

  constructor(integers: [NumberChar, ...NumberChar[]]) {
    super(integers[0]);
    this._integers = integers;
  }

  renderLatex(): string {
    return this._integers.map<string>(this._renderClickableLatex).join("");
  }

  toString(): string {
    return this._integers.map<string>((char) => char.toString()).join("");
  }
}
