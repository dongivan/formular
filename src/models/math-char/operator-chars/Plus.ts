import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.RegisterMathChar("+", "plus", "add")
export default class Plus extends OperatorChar {
  constructor() {
    super("+");
  }
}
