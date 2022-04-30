import OperandSymbol from "../OperandSymbol";

export default class SquareRoot extends OperandSymbol {
  protected _latexTemplate = "\\sqrt{<1>}";

  constructor() {
    super("sqrt");
    this._paramsNumber = 1;
  }
}
