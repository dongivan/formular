import { Config } from "../../Config";
import { Latex, MathML, WolframAlpha } from "../../renderer";
import { OperandChar } from "../internal";

@Latex.RenderChar(() => "█")
@MathML.RenderChar(({ h }) => [
  h(
    "mrow",
    {
      class: Config.getConfig().cursorCssClass,
    },
    Config.getConfig().cursorMathML
  ),
])
@WolframAlpha.RenderChar(() => "")
export default class Cursor extends OperandChar {
  constructor() {
    super("cursor");
  }
}
