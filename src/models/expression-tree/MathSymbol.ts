import MathChar from "../MathChar";

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
      for (let i = 0; i < latexParams.length; i++) {
        result = result.replace(
          new RegExp(`<${i + 1}>`, "g"),
          latexParams[i] || ""
        );
      }
    }
    if (this._char.clickable) {
      result = `\\htmlData{formular-char-sn=${this._char.sequenceNumber}}{${result}}`;
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
