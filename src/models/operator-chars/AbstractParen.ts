import Operator from "../OperatorChar";

export default abstract class AbstractParen extends Operator {
  protected _latexTemplate = "<1><2>";
  protected static readonly _PREFIXES = [
    "",
    "\\big",
    "\\Big",
    "\\bigg",
    "\\Bigg",
  ];
  level = 0;

  renderLatex(): string {
    const prefix =
      AbstractParen._PREFIXES[Math.min(Math.max(this.level, 0), 4)] || "";
    return super.renderLatex([prefix, this._value]);
  }
}
