import Formula from "../Formula";
import GenericSymbol from "../GenericSymbol";

export default class Placeholder extends GenericSymbol {
  static ID = 1;
  id: number;

  constructor(formula: Formula) {
    super(formula, "placeholder");
    this.id = Placeholder.ID;
    Placeholder.ID += 1;
  }

  toString(): string {
    return `_<${this.id}>`;
  }

  toJSON(): string {
    return this.toString();
  }

  insertOnRight(symbolName: string | number): GenericSymbol {
    const newSymbol = super.insertOnRight(symbolName);
    if (this.position > 0) {
      this.detach();
    }
    return newSymbol;
  }

  toLatex(): string {
    return "{\\htmlClass{formular-placeholder}{\\ ?\\ }}";
  }

  renderLatex(): string {
    const cursor = this.formula?.cursor;
    return cursor && cursor.symbol == this
      ? cursor.renderLatex()
      : this.visible
      ? this.toLatex()
      : "";
  }

  get visible(): boolean {
    if (this.position == 0 && this.formula?.length == 1) {
      return true;
    } else if (this.rightSymbol?.needLeft) {
      return true;
    }
    return false;
  }
}
