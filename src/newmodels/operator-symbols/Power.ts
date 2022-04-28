import OperatorSymbol from "../OperatorSymbol";

export default class Power extends OperatorSymbol {
  protected _latexTemplate = "^{<1>}";

  constructor() {
    super("^");
    this._priority = 3;
    this._hasRightOperand = false;
    this._paramsNumber = 1;
  }
}
