import Placeholder from "./operand-symbols/Placeholder";
import OperandSymbol from "./OperandSymbol";
import Formula from "./Formula";

export default class Operand {
  private _values: OperandSymbol[] = [];
  private _formula: Formula;

  constructor(formula: Formula) {
    this._values.push(new Placeholder());
    this._formula = formula;
  }

  get formula(): Formula {
    return this._formula;
  }

  get length(): number {
    return this._values.length;
  }

  get index(): number {
    return this._formula.indexOf(this);
  }

  insert(pos: number, symbol: OperandSymbol): void {
    this._values.splice(pos, 0, symbol);
  }

  toLatex(): string {
    const latexes: string[] = this._values.map<string>((symbol) =>
        symbol.toLatex()
      ),
      cursor = this._formula.cursor;
    if (cursor.operand == this) {
      latexes[cursor.pos] += cursor.toLatex();
    }
    return latexes.join("");
  }
}
