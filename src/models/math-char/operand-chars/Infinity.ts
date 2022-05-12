import { Latex, MathML } from "../../Renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar("infinity")
@Latex.RenderChar(() => "\\infty")
@MathML.RenderChar(({ h }) => [h("mi", "&#x221E;")])
export default class Infinity extends OperandChar {
  protected _clickable = true;

  constructor() {
    super("infinity");
  }
}
