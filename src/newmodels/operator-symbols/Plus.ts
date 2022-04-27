import Operator from "../OperatorSymbol";

export default class Plus extends Operator {
  constructor() {
    super("+");
    this._priority = 1;
  }
}
