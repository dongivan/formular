import OperandChar from "../OperandChar";

export default class SquareRoot extends OperandChar {
  readonly mmlTag = "msqrt";

  constructor() {
    super("sqrt");
    this._paramsNumber = 1;
  }
}
