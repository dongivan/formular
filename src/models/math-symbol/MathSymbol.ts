import { MathChar } from "../math-char";
import { replace } from "../utils";

export default abstract class MathSymbol<M extends MathChar> {
  protected _char: M;
  protected _params: MathChar[][] = [];

  constructor(char: M, params?: MathChar[][]) {
    this._char = char;
    this._params = params || [];
  }

  get char(): M {
    return this._char;
  }

  set params(groups: MathChar[][]) {
    this._params = groups;
  }

  get params(): MathChar[][] {
    return this._params;
  }

  get hasParams(): boolean {
    return this._params.length > 0;
  }

  renderLatex(
    renderParamsFn?: (params: MathChar[][]) => string[],
    leftLatex?: string,
    rightLatex?: string
  ): string;
  renderLatex(renderParamsFn?: (params: MathChar[][]) => string[]): string {
    let result = this._char.latexTemplate;
    const latexParams = renderParamsFn ? renderParamsFn(this.params) : [];
    if (latexParams) {
      result = replace(result, latexParams);
    }
    if (this._char.clickable) {
      result = replace(this._char.clickableLatexTemplate, {
        SN: this._char.sequenceNumber.toString(),
        LATEX: result,
      });
    }
    return result;
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
