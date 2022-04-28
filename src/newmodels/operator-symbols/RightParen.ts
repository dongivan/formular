import Operator from "../OperatorSymbol";

export default class RightParen extends Operator {
  constructor() {
    super("\\rparen");
    this._priority = -10;
    this._hasRightOperand = false;
  }

  toString(): string {
    return ")";
  }
}
