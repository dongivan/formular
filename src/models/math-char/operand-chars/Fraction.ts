import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar("fraction", "frac")
export default class Fraction extends OperandChar {
  constructor() {
    super("frac");
    this._paramsNumber = 2;
  }
}
