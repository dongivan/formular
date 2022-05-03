import OperatorChar from "../OperatorChar";

export default class Power extends OperatorChar {
  protected _latexTemplate = "^{<1>}";
  protected _leftOperandLatexTemplate = "{<1>}";

  constructor() {
    super("^");
    this._priority = 3;
    this._hasRightOperand = false;
    this._paramsNumber = 1;
  }
}
