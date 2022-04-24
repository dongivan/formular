import Cursor from "../Cursor";
import Formula from "../Formula";
import GenericSymbol from "../GenericSymbol";

export default class Placeholder extends GenericSymbol {
  constructor(formula: Formula) {
    super(formula, "placeholder");
  }

  insertOnRight(symbolName: string | number): GenericSymbol {
    const newSymbol = super.insertOnRight(symbolName);
    if (this.position > 0) {
      this.delete();
    }
    return newSymbol;
  }

  renderLatex(cursor?: Cursor): string {
    return cursor && cursor.symbol == this
      ? cursor.renderLatex()
      : this.visible
      ? "{\\htmlClass{formular-placeholder}{\\ ?\\ }}"
      : "";
  }

  get visible(): boolean {
    if (this.position == 0 && this.formula.length == 1) {
      return true;
    } else if (this.rightSymbol?.needLeft) {
      return true;
    }
    return false;
  }
}
