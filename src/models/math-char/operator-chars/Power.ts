import OperatorChar from "../OperatorChar";

export default class Power extends OperatorChar {
  constructor() {
    super("^");
    this._priority = OperatorChar.Priorities.Exponentiation;
    this._hasRightOperand = false;
    this._paramsNumber = 1;
  }
}
