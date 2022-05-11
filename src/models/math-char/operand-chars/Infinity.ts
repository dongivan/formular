import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar("infinity")
export default class Infinity extends OperandChar {
  protected _clickable = true;

  constructor() {
    super("infinity");
  }
}
