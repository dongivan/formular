import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.RegisterMathChar("!", "factorial")
export default class Factorial extends OperatorChar {
  constructor() {
    super("!");
    this._priority = OperatorChar.Priorities.Exponentiation;
    this._hasRightOperand = false;
  }
}
