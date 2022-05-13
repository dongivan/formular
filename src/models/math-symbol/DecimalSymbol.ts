import { Digit, DecimalPoint } from "../math-char";
import OperandSymbol from "./OperandSymbol";

export default class DecimalSymbol extends OperandSymbol {
  private _integers: Digit[];
  private _decimals: Digit[];

  get integers(): readonly Digit[] {
    return Object.freeze(this._integers);
  }

  get decimals(): readonly Digit[] {
    return Object.freeze(this._decimals);
  }

  constructor(args: {
    integers: Digit[];
    char: DecimalPoint;
    decimals: Digit[];
  }) {
    super(args);
    this._integers = args.integers;
    this._decimals = args.decimals;
  }

  toString(): string {
    return (
      this._integers.map<string>((char) => char.toString()).join("") +
      "." +
      this._decimals.map<string>((char) => char.toString()).join("")
    );
  }
}
