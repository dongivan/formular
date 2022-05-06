import { Digit } from "../math-char";
import NumberSymbol from "./NumberSymbol";

export default class IntegerSymbol extends NumberSymbol<Digit> {
  private _integers: Digit[];

  get integers(): readonly Digit[] {
    return Object.freeze(this._integers);
  }

  constructor(integers: [Digit, ...Digit[]]) {
    super(integers[0]);
    this._integers = integers;
  }

  toString(): string {
    return this._integers.map<string>((char) => char.toString()).join("");
  }
}
