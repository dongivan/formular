import AbstractParen from "./AbstractParen";

export default class RightParen extends AbstractParen {
  constructor() {
    super("\\rparen");
    this._priority = -10;
    this._hasRightOperand = false;
  }

  toString(): string {
    return ")";
  }
}
