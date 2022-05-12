import { MathCharFactory } from "../internal";
import AbstractParen from "./AbstractParen";

@MathCharFactory.registerMathChar("(", "left-paren")
export default class LeftParen extends AbstractParen {
  constructor(args: { sequenceNumber: number }) {
    super({ value: "(", sequenceNumber: args.sequenceNumber });
    this._priority = AbstractParen.Priorities.Parenthese;
    this._hasLeftOperand = false;
  }

  toString(): string {
    return "(";
  }
}
