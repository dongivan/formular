import { MathCharFactory } from "../internal";
import AbstractParen from "./AbstractParen";

@MathCharFactory.registerMathChar(")", "right-paren")
export default class RightParen extends AbstractParen {
  constructor(args: { sequenceNumber: number }) {
    super({ value: ")", sequenceNumber: args.sequenceNumber });
    this._priority = -AbstractParen.Priorities.Parenthese;
    this._hasRightOperand = false;
  }

  toString(): string {
    return ")";
  }
}
