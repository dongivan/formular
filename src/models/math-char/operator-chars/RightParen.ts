import AbstractParen from "./AbstractParen";

export default class RightParen extends AbstractParen {
  protected _mmlValueTemplate = ")";

  constructor() {
    super(")");
    this._priority = -AbstractParen.Priorities.Parenthese;
    this._hasRightOperand = false;
  }

  toString(): string {
    return ")";
  }
}
