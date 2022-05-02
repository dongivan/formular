import Config from "../Config";
import MathSymbol from "../MathSymbol";
import OperandSymbol from "../OperandSymbol";

export default class Placeholder extends OperandSymbol {
  protected _clickable = true;

  private _masterSymbol: MathSymbol;
  private _masterOffset: -1 | 1 = -1;

  constructor(master: MathSymbol, offset: -1 | 1) {
    super("placeholder");
    this._latexTemplate = Config.getConfig().placeholderLatex;
    this._masterSymbol = master;
    this._masterOffset = offset;
  }

  get masterSymbol(): MathSymbol {
    return this._masterSymbol;
  }

  get masterOffset(): number {
    return this._masterOffset;
  }
}
