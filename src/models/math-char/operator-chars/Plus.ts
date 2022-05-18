import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.RegisterMathChar("+", "plus")
export default class Plus extends OperatorChar {
  constructor() {
    super("+");
  }
}
