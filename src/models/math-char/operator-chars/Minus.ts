import Operator from "../OperatorChar";

export default class Minus extends Operator {
  constructor() {
    super("-");
    this._priority = 1;
  }
}
