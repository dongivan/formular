import Cursor from "./Cursor";
import Formula from "./Formula";
import Symbols from "./Symbols";

export default class GenericSymbol {
  formula: Formula;
  value: string;
  needLeft = false;
  needRight = false;

  constructor(formula: Formula, value: string) {
    this.formula = formula;
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }

  get position(): number {
    return this.formula.indexOf(this);
  }

  get leftSymbol(): GenericSymbol | undefined {
    return this.formula[this.position - 1];
  }

  get rightSymbol(): GenericSymbol | undefined {
    return this.formula[this.position + 1];
  }

  detach(): void {
    this.formula.delete(this.position);
  }

  replaceBy(...newSymbols: GenericSymbol[] | Formula): void {
    this.formula.replace(this.position, ...newSymbols);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInsert(leftSymbol: GenericSymbol): GenericSymbol {
    return this;
  }

  insertOnRight(symbolName: string | number): GenericSymbol {
    if (!this.formula) {
      throw new Error("Math Symbol is not in a Formula!");
    }
    let newSymbol = Symbols.makeSymbol(this.formula, symbolName);
    this.formula.insert(this.position + 1, newSymbol);
    newSymbol = newSymbol.afterInsert(this);
    return newSymbol;
  }

  deleteFromRight(): GenericSymbol {
    const operation = this.formula.getOperation("deleteFromRight", this);
    const symbol = operation?.run(this);
    if (symbol instanceof GenericSymbol) {
      return symbol;
    } else {
      throw new Error("DeleteFromRight should return a GenericSymbol object!");
    }
  }

  sendCursorToLeft(): void {
    const operation = this.formula.getOperation("sendCursorToLeft", this);
    operation?.run(this);
  }

  sendCursorToRight(): void {
    const operation = this.formula.getOperation("sendCursorToRight", this);
    operation?.run(this);
  }

  receiveCursorFromRight(cursor: Cursor): void {
    cursor.symbol = this;
  }

  receiveCursorFromLeft(cursor: Cursor): void {
    cursor.symbol = this;
  }

  toLatex(): string {
    return this.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderLatex(): string {
    return (
      this.toLatex() +
      (this.formula.cursor.symbol == this
        ? this.formula.cursor.renderLatex()
        : "")
    );
  }
}
