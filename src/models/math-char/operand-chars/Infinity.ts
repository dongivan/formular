import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("infinity")
@Latex.RenderChar(() => "\\infty")
@MathML.RenderChar(({ h }) => [h("mi", "&#x221E;")])
@WolframAlpha.RenderChar(() => "∞")
export default class Infinity extends OperandChar {
  protected _interactive = true;

  constructor() {
    super("infinity");
  }
}
