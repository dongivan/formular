import Operator from "../OperatorSymbol";

export default class ParamSeparator extends Operator {
  constructor() {
    super("|");
    this._priority = 1;
  }
}
