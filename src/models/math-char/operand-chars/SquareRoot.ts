import OperandChar from "../OperandChar";

export default class SquareRoot extends OperandChar {
  protected _latexTemplate = "\\sqrt{<0>}";
  readonly mmlTag = "msqrt";

  constructor() {
    super("sqrt");
    this._paramsNumber = 1;
  }
}
