import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar(".", "point")
export default class DecimalPoint extends OperandChar {
  protected _clickable = true;

  constructor() {
    super(".");
  }
}
