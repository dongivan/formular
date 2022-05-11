import { MathCharFactory } from "../internal";
import AbstractParen from "./AbstractParen";

@MathCharFactory.registerMathChar(")", "right-paren")
export default class RightParen extends AbstractParen {
  constructor(_?: string, sn = 0) {
    super(")", sn);
    this._priority = -AbstractParen.Priorities.Parenthese;
    this._hasRightOperand = false;
  }

  toString(): string {
    return ")";
  }
}
