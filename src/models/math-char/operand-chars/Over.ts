import OperandChar from "../OperandChar";

export default class Over extends OperandChar {
  protected _latexTemplate = "\\frac{<0>}{<1>}";

  constructor() {
    super("over");
    this._paramsNumber = 2;
  }
}
