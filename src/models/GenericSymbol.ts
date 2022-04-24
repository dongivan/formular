import Cursor from "./Cursor";
import Formula from "./Formula";
import Symbols from "./Symbols";

export default class GenericSymbol {
  formula: Formula | undefined | null;
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
    return this.formula ? this.formula.indexOf(this) : -1;
  }

  get leftSymbol(): GenericSymbol | undefined {
    const pos = this.position;
    return this.formula ? this.formula[pos - 1] : undefined;
  }

  get rightSymbol(): GenericSymbol | undefined {
    const pos = this.position;
    return this.formula ? this.formula[pos + 1] : undefined;
  }

  delete(): void {
    console.log("delete", this.position);
    this.formula?.delete(this.position);
    this.formula = undefined;
  }

  replaceBy(newSymbol: GenericSymbol): void {
    this.formula?.replace(this.position, newSymbol);
    this.formula = undefined;
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

  sendCursorToLeft(cursor: Cursor): void {
    if (cursor.symbol !== this) {
      cursor.symbol = this;
    }
    const leftSymbol = this.leftSymbol;
    if (leftSymbol) {
      leftSymbol.receiveCursorFromRight(cursor);
    } else {
      if (this.formula?.parentFunction) {
        const parentFunctionParams = this.formula.parentFunction.params;
        const formulaIndex = parentFunctionParams.indexOf(this.formula);
        if (formulaIndex == 0) {
          const parentLeftSymbol = this.formula.parentFunction.leftSymbol;
          /* the first symbol of a formula MUST be a Placeholder */
          parentLeftSymbol?.receiveCursorFromRight(cursor);
        } else {
          const prevFormula = parentFunctionParams[formulaIndex - 1];
          prevFormula[prevFormula.length - 1].receiveCursorFromRight(cursor);
        }
      }
    }
  }

  sendCursorToRight(cursor: Cursor): void {
    if (cursor.symbol !== this) {
      cursor.symbol = this;
    }
    const rightSymbol = this.rightSymbol;
    if (rightSymbol) {
      rightSymbol.receiveCursorFromLeft(cursor);
    } else {
      if (this.formula?.parentFunction) {
        const parentFunctionParams = this.formula.parentFunction.params;
        const formulaIndex = parentFunctionParams.indexOf(this.formula);
        if (formulaIndex == parentFunctionParams.length - 1) {
          /* parent(MathFunction) should receive cursor like from right */
          this.formula.parentFunction.receiveCursorFromRight(cursor);
        } else {
          const prevFormula = parentFunctionParams[formulaIndex + 1];
          prevFormula[0].receiveCursorFromLeft(cursor);
        }
      }
    }
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
      (this.formula?.cursor.symbol == this
        ? this.formula.cursor.renderLatex()
        : "")
    );
  }
}
