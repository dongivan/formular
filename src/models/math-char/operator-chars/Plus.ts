import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.registerMathChar("+", "plus")
export default class Plus extends OperatorChar {
  constructor() {
    super("+");
  }
}
