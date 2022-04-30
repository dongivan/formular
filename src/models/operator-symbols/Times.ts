import Operator from "../OperatorSymbol";

export default class Times extends Operator {
  constructor() {
    super("\\times");
    this._priority = 2;
  }
}
