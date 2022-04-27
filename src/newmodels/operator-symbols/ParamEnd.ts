import Operator from "../OperatorSymbol";

export default class ParamEnd extends Operator {
  constructor() {
    super("#");
    this._priority = 1;
    this._hasRightOperand = false;
  }
}
