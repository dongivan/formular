import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar("sqrt", "square-root")
export default class SquareRoot extends OperandChar {
  constructor() {
    super("sqrt");
    this._paramsNumber = 1;
  }
}
