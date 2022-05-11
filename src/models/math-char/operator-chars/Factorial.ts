import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.registerMathChar("!", "factorial")
export default class Factorial extends OperatorChar {
  constructor() {
    super("!");
    this._priority = OperatorChar.Priorities.Exponentiation;
    this._hasRightOperand = false;
  }
}
