import OperandSymbol from "../OperandSymbol";

export default class Cursor extends OperandSymbol {
  constructor() {
    super("cursor");
  }

  toLatex(): string {
    return "{\\htmlClass{formular-cursor}{\\ \\ \\ }}";
  }
}
