import Operator from "../OperatorChar";

export default class ParamSeparator extends Operator {
  constructor() {
    super("|");
    this._priority = 1;
  }
}