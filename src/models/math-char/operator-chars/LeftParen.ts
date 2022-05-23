import { WolframAlpha } from "../../renderer";
import { MathCharFactory } from "../internal";
import AbstractParen from "./AbstractParen";

@MathCharFactory.RegisterMathChar("(", "left-paren")
@WolframAlpha.RenderChar(({ char }) => ((char as LeftParen).phontom ? "" : "("))
export default class LeftParen extends AbstractParen {
  constructor(args?: { sequenceNumber?: number; phontom?: boolean }) {
    super({ value: "(", sequenceNumber: args?.sequenceNumber });
    this.phontom = args?.phontom || false;
    this._priority = AbstractParen.Priorities.Parenthese;
    this._hasLeftOperand = false;
  }

  toString(): string {
    return "(";
  }
}
