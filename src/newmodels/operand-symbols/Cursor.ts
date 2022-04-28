import OperandSymbol from "../OperandSymbol";

export default class Cursor extends OperandSymbol {
  protected _latexTemplate = "{\\htmlClass{formular-cursor}{\\ \\ \\ }}";

  constructor() {
    super("cursor");
  }
}
