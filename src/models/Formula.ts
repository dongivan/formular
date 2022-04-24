import GenericSymbol from "./GenericSymbol";
import Cursor from "./Cursor";
import Placeholder from "./controls/Placeholder";
import MathFunction from "./MathFunction";

export default class Formula extends Array<GenericSymbol> {
  rootFormula: Formula | undefined;
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
    console.log("before push", this.length);
    const result = super.push(...items);
    console.log("pushed", this.length);
    console.log("0", this[0]);
    if (this[1]) {
      console.log("1", this[1]);
    }
    return result;
  }

  delete(pos: number) {
    const symbol = this[pos];
    symbol.formula = undefined;
    for (let i = pos; i < this.length - 1; i++) {
      this[i] = this[i + 1];
    }
    this.pop();
  }

  replace(pos: number, newSymbol: GenericSymbol) {
    this[pos] = newSymbol;
    newSymbol.formula = this;
  }

  insert(pos: number, newSymbol: GenericSymbol) {
    for (let i = this.length; i > pos; i--) {
      this[i] = this[i - 1];
    }
    this[pos] = newSymbol;
    newSymbol.formula = this;
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
