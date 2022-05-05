import Operator from "../OperatorChar";

export default class Times extends Operator {
  constructor() {
    super("\\times");
    this._priority = 2;
  }
}
