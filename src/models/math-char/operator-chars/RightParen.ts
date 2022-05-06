import AbstractParen from "./AbstractParen";

export default class RightParen extends AbstractParen {
  constructor() {
    super(")");
    this._priority = -AbstractParen.Priorities.Parenthese;
    this._hasRightOperand = false;
  }

  toString(): string {
    return ")";
  }
}
