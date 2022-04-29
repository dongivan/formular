import OperandSymbol from "../OperandSymbol";

export default class Placeholder extends OperandSymbol {
  protected _latexTemplate =
    "\\htmlClass{formular-placeholder}{\\ ?\\ \\mathstrut}";

  constructor() {
    super("placeholder");
  }
}
