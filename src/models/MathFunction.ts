import BaseSymbol from "./BaseSymbol";
import Cursor from "./Cursor";
import Formula from "./Formula";

export default abstract class MathFunction extends BaseSymbol {
  needLeft = false;
  params: Formula[];
  parentFormula: Formula;

  constructor(value: string, parent: Formula, paramsCount: number) {
    super(value);
    this.parentFormula = parent;
    this.params = Array.from({ length: paramsCount }).map(
      () => new Formula(this)
    );
  }

  toJSON(): string {
    return `[${this.value}, ${this.params
      .map((formula) => formula.toJSON())
      .join(", ")}]`;
  }

  renderLatex(cursor?: Cursor): string {
    let latex = this.value;
    for (const formula of this.params) {
      latex += "{" + formula.renderLatex(cursor) + "}";
    }
    return latex;
  }
}
