import OperatorSymbol from "../OperatorSymbol";

export default class Power extends OperatorSymbol {
  constructor() {
    super("^");
    this._priority = 3;
    this._hasRightOperand = false;
    this._paramsNumber = 1;
  }
}
