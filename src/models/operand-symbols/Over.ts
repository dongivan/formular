import OperandSymbol from "../OperandSymbol";

export default class Over extends OperandSymbol {
  protected _latexTemplate = "\\frac{<1>}{<2>}";

  constructor() {
    super("over");
    this._paramsNumber = 2;
  }
}
