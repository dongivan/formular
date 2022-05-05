import OperatorChar from "../OperatorChar";

export default class Power extends OperatorChar {
  protected _latexTemplate = "^{<0>}";
  protected _leftOperandLatexTemplate = "{<0>}";

  constructor() {
    super("^");
    this._priority = 3;
    this._hasRightOperand = false;
    this._paramsNumber = 1;
  }
}
