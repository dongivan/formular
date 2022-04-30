import OperatorSymbol from "../OperatorSymbol";

export default class HiddenTimes extends OperatorSymbol {
  protected _latexTemplate = "";

  constructor() {
    super("·");
    this._priority = 2;
  }
}
