import Operator from "../OperatorSymbol";

export default class HiddenTimes extends Operator {
  constructor() {
    super("");
    this._priority = 1;
  }
}
