import { NumberChar } from "../math-char";
import NumberSymbol from "./NumberSymbol";

export default class IntegerSymbol extends NumberSymbol<NumberChar> {
  private _integers: NumberChar[];

  get integers(): readonly NumberChar[] {
    return Object.freeze(this._integers);
  }

  constructor(integers: [NumberChar, ...NumberChar[]]) {
    super(integers[0]);
    this._integers = integers;
  }

  toString(): string {
    return this._integers.map<string>((char) => char.toString()).join("");
  }
}
