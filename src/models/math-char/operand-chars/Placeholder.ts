import { Config } from "../../Config";
import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathChar, OperandChar } from "../internal";

@Latex.RenderChar(() => "⍰")
@MathML.RenderChar(({ h }) => [
  h("mrow", {
    value: Config.getConfig().placeholderMathML,
    class: Config.getConfig().placeholderCssClass,
  }),
])
@WolframAlpha.RenderChar(() => "")
export default class Placeholder extends OperandChar {
  protected _interactive = true;

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
