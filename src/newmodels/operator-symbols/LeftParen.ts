import AbstractParen from "./AbstractParen";

export default class LeftParen extends AbstractParen {
  constructor() {
    super("\\lparen");
    this._priority = 10;
    this._hasLeftOperand = false;
  }

  toString(): string {
    return "(";
  }
}
