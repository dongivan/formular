import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar("i-integral")
export default class IIntegral extends OperandChar {
  protected _paramsNumber = 2;

  constructor() {
    super("i-integral");
  }
}
