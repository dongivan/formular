import { Digit } from "../math-char";
import OperandNode from "./OperandNode";

export default class IntegerNode extends OperandNode {
  private _integers: Digit[];

  get integers(): readonly Digit[] {
    return Object.freeze(this._integers);
  }

  constructor(args: { char: Digit; integers: Digit[] }) {
    super(args);
    this._integers = args.integers;
  }

  protected _reuse(args: { char: Digit; integers: Digit[] }) {
    super._reuse(args);
    if (this._integers !== args.integers) {
      this._integers = args.integers;
    }
  }

  toString(): string {
    return this._integers.map<string>((char) => char.toString()).join("");
  }
}
