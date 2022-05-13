import { Digit } from "../math-char";
import OperandSymbol from "./OperandSymbol";

export default class IntegerSymbol extends OperandSymbol {
  private _integers: Digit[];

  get integers(): readonly Digit[] {
    return Object.freeze(this._integers);
  }

  constructor(args: { char: Digit; integers: Digit[] }) {
    super(args);
    this._integers = args.integers;
  }

  toString(): string {
    return this._integers.map<string>((char) => char.toString()).join("");
  }
}
