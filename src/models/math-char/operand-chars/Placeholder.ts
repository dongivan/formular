import { replace } from "@/models/utils";
import Config from "../../Config";
import MathChar from "../MathChar";
import OperandChar from "../OperandChar";

export default class Placeholder extends OperandChar {
  protected _clickable = true;

  private _masterChar: MathChar;
  private _masterOffset: -1 | 1 = -1;

  constructor(master: MathChar, offset: -1 | 1) {
    super("placeholder");
    this._latexTemplate = replace(
      Config.getConfig().placeholderLatex || "",
      Config.getConfig().placeholderCssClass || ""
    );
    this._mmlValueTemplate = Config.getConfig().placeholderMML;
    this.mmlAttrs.class = Config.getConfig().placeholderCssClass || "";
    this._masterChar = master;
    this._masterOffset = offset;
  }

  get masterChar(): MathChar {
    return this._masterChar;
  }

  get masterOffset(): number {
    return this._masterOffset;
  }
}
