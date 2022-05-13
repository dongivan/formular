import { MathChar } from "../math-char";

export default abstract class MathSymbol<M extends MathChar> {
  protected _char: M;
  protected _params: MathChar[][] = [];

  constructor(
    args:
      | {
          char: M;
          params?: MathChar[][];
        }
      | M
  ) {
    if (args instanceof MathChar) {
      this._char = args;
      this._params = [];
    } else {
      this._char = args.char;
      this._params = args.params || [];
    }
  }

  get char(): M {
    return this._char;
  }

  get params(): MathChar[][] {
    return this._params;
  }

  get hasParams(): boolean {
    return this._params.length > 0;
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
