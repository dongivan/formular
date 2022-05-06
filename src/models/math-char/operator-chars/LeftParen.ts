import AbstractParen from "./AbstractParen";

export default class LeftParen extends AbstractParen {
  protected _mmlValueTemplate = "(";

  constructor() {
    super("\\lparen");
    this._priority = AbstractParen.Priorities.Parenthese;
    this._hasLeftOperand = false;
  }

  toString(): string {
    return "(";
  }
}
