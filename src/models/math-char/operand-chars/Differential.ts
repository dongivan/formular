import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar("differential", "dif")
export default class Differential extends OperandChar {
  constructor() {
    super("dif");
    this._paramsNumber = 2;
  }
}
