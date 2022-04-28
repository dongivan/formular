import OperandSymbol from "../OperandSymbol";

export default class Cursor extends OperandSymbol {
  protected _latexTemplate =
    "\\colorbox{transparent}{\\htmlClass{formular-cursor}{\\phantom{O}}}";

  constructor() {
    super("cursor");
  }
}
