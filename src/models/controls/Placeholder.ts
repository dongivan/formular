import Formula from "../Formula";
import GenericSymbol from "../GenericSymbol";

export default class Placeholder extends GenericSymbol {
  static ID = 1;
  id: number;

  constructor(formula: Formula) {
    super(formula, "placeholder");
    this.id = Placeholder.ID;
    Placeholder.ID += 1;
    console.log("placeholder", this.id, "created");
  }

  toString(): string {
    return `placeholder<${this.id}>`;
  }

  toJSON(): string {
    return this.toString();
  }

  insertOnRight(symbolName: string | number): GenericSymbol {
    const newSymbol = super.insertOnRight(symbolName);
    if (this.position > 0) {
      console.log("delete after insert on right");
      this.delete();
    }
    return newSymbol;
  }

  renderLatex(): string {
    const cursor = this.formula?.cursor;
    return cursor && cursor.symbol == this
      ? cursor.renderLatex()
      : this.visible
      ? "{\\htmlClass{formular-placeholder}{\\ ?\\ }}"
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
