import { Digit, DecimalPoint } from "../math-char";
import NumberSymbol from "./NumberSymbol";

export default class DecimalSymbol extends NumberSymbol<DecimalPoint> {
  private _integers: Digit[];
  private _decimals: Digit[];

  get integers(): readonly Digit[] {
    return Object.freeze(this._integers);
  }

  get decimals(): readonly Digit[] {
    return Object.freeze(this._decimals);
  }

  constructor(
    integers: Digit[],
    decimalPoint: DecimalPoint,
    decimals: Digit[]
  ) {
    super(decimalPoint);
    this._integers = integers;
    this._decimals = decimals;
  }

  toString(): string {
    return (
      this._integers.map<string>((char) => char.toString()).join("") +
      "." +
      this._decimals.map<string>((char) => char.toString()).join("")
    );
  }
}
