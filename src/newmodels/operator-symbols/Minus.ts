import Operator from "../OperatorSymbol";

export default class Minus extends Operator {
  constructor() {
    super("-");
    this._priority = 1;
  }
}
