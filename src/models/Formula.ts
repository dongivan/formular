import GenericSymbol from "./GenericSymbol";
import Cursor from "./Cursor";
import Placeholder from "./controls/Placeholder";
import MathFunction from "./MathFunction";

export default class Formula extends Array<GenericSymbol> {
  parentFunction: MathFunction | undefined;

  constructor(parent?: MathFunction) {
    super();
    this.parentFunction = parent;
    this.push(new Placeholder());
  }

  toJSON(): string {
    return "[" + this.map((symbol) => symbol.toJSON()).join(", ") + "]";
  }

  renderLatex(cursor?: Cursor): string {
    const latexes = this.map((symbol) => symbol.renderLatex(cursor));
    if (cursor && cursor.formula === this) {
      if (cursor.position >= latexes.length) {
        latexes.push(cursor.renderLatex());
      } else if (this[cursor.position] instanceof Placeholder) {
        latexes[cursor.position] = cursor.renderLatex();
      } else {
        latexes.splice(cursor.position, 0, cursor.renderLatex());
      }
    }

    return latexes.join("");
  }
}
