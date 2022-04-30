import Config from "../Config";
import OperandSymbol from "../OperandSymbol";

export default class Placeholder extends OperandSymbol {
  constructor() {
    super("placeholder");
    this._latexTemplate = Config.getConfig().placeholderLatex;
  }
}
