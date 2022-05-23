import { Config } from "../../Config";
import { Latex, MathML, WolframAlpha } from "../../renderer";
import { OperandChar } from "../internal";

@Latex.RenderChar(() => "█")
@MathML.RenderChar(({ h }) => [
  h("mrow", {
    value: Config.getConfig().cursorMathML,
    class: Config.getConfig().cursorCssClass,
  }),
])
@WolframAlpha.RenderChar(() => "")
export default class Cursor extends OperandChar {
  constructor() {
    super("cursor");
  }
}
