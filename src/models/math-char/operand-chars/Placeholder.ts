import { Config } from "../../Config";
import { Latex, MathML } from "../../renderer";
import { MathChar, OperandChar } from "../internal";

@Latex.RenderChar(() => "⍰")
@MathML.RenderChar(({ h }) => [
  h("mrow", {
    value: Config.getConfig().placeholderMathML,
    attrs: { class: Config.getConfig().placeholderCssClass },
  }),
])
export default class Placeholder extends OperandChar {
  protected _clickable = true;

  private _masterChar: MathChar;
  private _masterOffset: -1 | 1 = -1;

  constructor(args: { master: MathChar; offset: -1 | 1 }) {
    super("placeholder");
    this._masterChar = args.master;
    this._masterOffset = args.offset;
  }

  get masterChar(): MathChar {
    return this._masterChar;
  }

  get masterOffset(): number {
    return this._masterOffset;
  }
}
