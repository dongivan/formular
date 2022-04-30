import Config from "../Config";
import OperandSymbol from "../OperandSymbol";

export default class Cursor extends OperandSymbol {
  constructor() {
    super("cursor");
    this._latexTemplate = Config.getConfig().cursorLatex;
  }
}
