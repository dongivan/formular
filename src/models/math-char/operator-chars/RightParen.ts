import { WolframAlpha } from "../../renderer";
import { MathCharFactory } from "../internal";
import AbstractParen from "./AbstractParen";

@MathCharFactory.RegisterMathChar(")", "right-paren")
@WolframAlpha.RenderChar(({ char }) =>
  (char as RightParen).phontom ? "" : ")"
)
export default class RightParen extends AbstractParen {
  constructor(args?: { sequenceNumber?: number; phontom?: boolean }) {
    super({ value: ")", sequenceNumber: args?.sequenceNumber });
    this.phontom = args?.phontom || false;
    this._priority = -AbstractParen.Priorities.Parenthese;
    this._hasRightOperand = false;
  }

  toString(): string {
    return ")";
  }
}
