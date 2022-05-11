import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.registerMathChar("*", "times", "multiple")
export default class Times extends OperatorChar {
  constructor() {
    super("*");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
