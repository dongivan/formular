import Operator from "../OperatorSymbol";

export default abstract class AbstractParen extends Operator {
  level = 0;
  protected static readonly _PREFIXES = [
    "",
    "\\big",
    "\\Big",
    "\\bigg",
    "\\Bigg",
  ];

  renderLatex(params?: string[]): string {
    const prefix =
      AbstractParen._PREFIXES[Math.min(Math.max(this.level, 0), 4)] || "";
    return prefix + super.renderLatex(params);
  }
}
