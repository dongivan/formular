import Operator from "../OperatorSymbol";

export default class LeftParen extends Operator {
  constructor() {
    super("\\lparen");
    this._priority = 10;
    this._hasLeftOperand = false;
  }

  toJSON(): string {
    return "(";
  }
}
