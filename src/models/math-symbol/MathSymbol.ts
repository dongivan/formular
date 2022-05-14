import { MathChar } from "../math-char";

export default abstract class MathSymbol {
  protected _char: MathChar;
  protected _params: MathChar[][] = [];

  constructor(args: { char: MathChar; params?: MathChar[][] }) {
    this._char = args.char;
    this._params = args.params || [];
  }

  get char(): MathChar {
    return this._char;
  }

  get params(): MathChar[][] {
    return this._params;
  }

  toString(): string {
    return (
      this._char.toString() +
      (this._params.length > 0
        ? "(" +
          this.params.map<string>((param) =>
            param.map<string>((group) => group.toString()).join(", ")
          ) +
          ")"
        : "")
    );
  }
}
