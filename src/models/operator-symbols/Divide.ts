import Operator from "../OperatorSymbol";

export default class Divide extends Operator {
  constructor() {
    super("\\div");
    this._priority = 2;
  }
}
