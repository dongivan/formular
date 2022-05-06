import AbstractParen from "./AbstractParen";

export default class LeftParen extends AbstractParen {
  constructor() {
    super("(");
    this._priority = AbstractParen.Priorities.Parenthese;
    this._hasLeftOperand = false;
  }

  toString(): string {
    return "(";
  }
}
