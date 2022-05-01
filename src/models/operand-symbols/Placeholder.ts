import Config from "../Config";
import MathSymbol from "../MathSymbol";
import OperandSymbol from "../OperandSymbol";

export default class Placeholder extends OperandSymbol {
  _masterSymbol: MathSymbol | undefined;
  _masterOffset: -1 | 1 = -1;

  constructor() {
    super("placeholder");
    this._latexTemplate = Config.getConfig().placeholderLatex;
  }

  setMasterSymbol(master: MathSymbol, offset: -1 | 1) {
    this._masterSymbol = master;
    this._masterOffset = offset;
  }

  get masterSymbol(): MathSymbol | undefined {
    return this._masterSymbol;
  }

  get masterOffset(): number {
    return this._masterOffset;
  }
}
