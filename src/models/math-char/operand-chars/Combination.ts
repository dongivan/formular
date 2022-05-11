import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar("combination")
export default class Combination extends OperandChar {
  constructor() {
    super("combination");
    this._paramsNumber = 2;
  }
}
