import OperandSymbol from "../OperandSymbol";

export default class Placeholder extends OperandSymbol {
  protected _latexTemplate =
    "{\\colorbox{transparent}{\\htmlClass{formular-placeholder}{\\ ?\\ }}}";

  constructor() {
    super("placeholder");
  }
}
