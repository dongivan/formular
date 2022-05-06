import Operator from "../OperatorChar";

export default class ParamEnd extends Operator {
  constructor() {
    super("#");
    this._hasRightOperand = false;
  }
}
