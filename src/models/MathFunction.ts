import GenericSymbol from "./GenericSymbol";
import Cursor from "./Cursor";
import Formula from "./Formula";

export default class MathFunction extends GenericSymbol {
  params: Formula[];

  constructor(formula: Formula, value: string, paramsCount: number) {
    super(formula, value);
    this.formula = formula;
    this.params = Array.from({ length: paramsCount }).map(
      () => new Formula(formula.rootFormula, this)
    );
  }

  toJSON(): string {
    return `[${this.value}, ${new Array(this.params.length)
      .fill(null)
      .map((_, index) => this.params[index].toJSON())
      .join(", ")}]`;
  }

  sendCursorToLeft(cursor: Cursor): void {
    if (cursor.symbol !== this) {
      cursor.symbol = this;
    }
    const lastFormula = this.params[this.params.length - 1];
    const lastSymbol = lastFormula[lastFormula.length - 1];
    lastSymbol.receiveCursorFromRight(cursor);
  }

  receiveCursorFromLeft(cursor: Cursor): void {
    this.params[0][0].receiveCursorFromLeft(cursor);
  }

  toLatex(): string {
    let latex = this.value;
    for (const formula of this.params) {
      latex += "{" + formula.renderLatex() + "}";
    }
    return latex;
  }
}
