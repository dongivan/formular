import Config from "../../Config";
import { Latex, MathML } from "../../Renderer";
import { OperandChar } from "../internal";

@Latex.RenderChar(() => "█")
@MathML.RenderChar(({ h }) => [
  h("mrow", {
    value: Config.getConfig().cursorMathML,
    attrs: { class: Config.getConfig().cursorCssClass },
  }),
])
export default class Cursor extends OperandChar {
  constructor() {
    super("cursor");
  }
}
