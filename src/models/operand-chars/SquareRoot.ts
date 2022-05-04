import OperandChar from "../OperandChar";

export default class SquareRoot extends OperandChar {
  protected _latexTemplate = "\\sqrt{<0>}";

  constructor() {
    super("sqrt");
    this._paramsNumber = 1;
  }
}
