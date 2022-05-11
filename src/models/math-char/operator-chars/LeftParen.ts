import { MathCharFactory } from "../internal";
import AbstractParen from "./AbstractParen";

@MathCharFactory.registerMathChar("(", "left-paren")
export default class LeftParen extends AbstractParen {
  constructor(_?: string, sn = 0) {
    super("(", sn);
    this._priority = AbstractParen.Priorities.Parenthese;
    this._hasLeftOperand = false;
  }

  toString(): string {
    return "(";
  }
}
