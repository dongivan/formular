import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.registerMathChar("/", "divide")
export default class Divide extends OperatorChar {
  constructor() {
    super("/");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
