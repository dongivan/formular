import Operator from "../OperatorChar";

export default class Plus extends Operator {
  constructor() {
    super("+");
    this._priority = 1;
  }
}