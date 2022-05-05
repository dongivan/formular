import { MMLParenRenderer } from "../../renderer";
import Operator from "../OperatorChar";

export default abstract class AbstractParen extends Operator {
  readonly mmlRenderer = MMLParenRenderer;
  protected static readonly _LATEX_PREFIXES = [
    "",
    "\\big",
    "\\Big",
    "\\bigg",
    "\\Bigg",
  ];
  level = 0;

  get latexTemplate(): string {
    return (
      (AbstractParen._LATEX_PREFIXES[Math.min(Math.max(this.level, 0), 4)] ||
        "") + this._value
    );
  }
}
