import GenericSymbol from "./GenericSymbol";
import Cursor from "./Cursor";
import Placeholder from "./controls/Placeholder";
import MathFunction from "./MathFunction";
import { SymbolOperation, SimpleOperations } from "./operations";

export default class Formula extends Array<GenericSymbol> {
  static SYMBOL_OPERATIONS: {
    [key: string]: SymbolOperation;
  } = {
    sendCursorToLeft: new SimpleOperations.SendCursorToLeft(),
    sendCursorToRight: new SimpleOperations.SendCursorToRight(),
    deleteFromRight: new SimpleOperations.DeleteFromRight(),
  };
  rootFormula: Formula;
  parentFunction: MathFunction | undefined;
  cursor: Cursor;

  constructor(root?: Formula | undefined, parent?: MathFunction) {
    super();
    this.parentFunction = parent;
    const defaultPlaceholder = new Placeholder(this);
    this.push(defaultPlaceholder);
    if (root) {
      this.rootFormula = root;
      this.cursor = root.cursor;
    } else {
      this.rootFormula = this;
      this.cursor = new Cursor(defaultPlaceholder);
    }
  }

  getOperation(
    operName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbol: GenericSymbol
  ): SymbolOperation | undefined {
    if (this.parentFunction) {
      const operation = this.parentFunction.getParamsOperation(
        operName,
        symbol
      );
      if (operation) {
        return operation;
      }
    }
    return Formula.SYMBOL_OPERATIONS[operName];
  }

  toJSON(): string {
    return (
      "[" +
      new Array(this.length)
        .fill(null)
        .map((_, index) => this[index].toJSON())
        .join(", ") +
      "]"
    );
  }

  push(...items: GenericSymbol[]): number {
    items.forEach((item) => (item.formula = this));
    const result = super.push(...items);
    return result;
  }

  delete(pos: number) {
    if (pos < 0) {
      return;
    }
    for (let i = pos; i < this.length - 1; i++) {
      this[i] = this[i + 1];
    }
    this.pop();
  }

  replace(pos: number, ...newSymbols: GenericSymbol[]) {
    const first = newSymbols.shift();
    if (!first) {
      this.delete(pos);
      return;
    }
    first.formula = this;
    this[pos] = first;
    this.insert(pos + 1, ...newSymbols);
  }

  insert(pos: number, ...newSymbols: GenericSymbol[]): void {
    const insertLength = newSymbols.length;
    if (insertLength == 0) {
      return;
    }
    for (
      let i = this.length - 1 + insertLength;
      i > pos - 1 + insertLength;
      i--
    ) {
      this[i] = this[i - insertLength];
    }
    for (let i = 0; i < insertLength; i++) {
      const newSymbol = newSymbols.pop() as GenericSymbol;
      newSymbol.formula = this;
      this[pos + insertLength - i - 1] = newSymbol;
    }
  }

  insertPlaceholder(pos: number) {
    this.insert(pos, new Placeholder(this));
  }

  renderLatex(bracket: boolean | string = false): string {
    let latex = new Array(this.length)
      .fill(null)
      .map((_, index) => this[index].renderLatex())
      .join("");
    if (bracket) {
      const brkt = bracket === true ? "paren" : bracket;
      latex = `\\l${brkt}${latex}\\r${brkt}`;
    }

    return latex;
  }
}
