import { NumberChar, DecimalPoint } from "../math-char";
import NumberSymbol from "./NumberSymbol";

export default class DecimalSymbol extends NumberSymbol<DecimalPoint> {
  private _integers: NumberChar[];
  private _decimals: NumberChar[];

  get integers(): readonly NumberChar[] {
    return Object.freeze(this._integers);
  }

  get decimals(): readonly NumberChar[] {
    return Object.freeze(this._decimals);
  }

  constructor(
    integers: NumberChar[],
    decimalPoint: DecimalPoint,
    decimals: NumberChar[]
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
