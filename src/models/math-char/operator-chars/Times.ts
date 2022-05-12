import { Latex, MathML } from "../../Renderer";
import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.registerMathChar("*", "times", "multiple")
@Latex.RenderChar(() => "\\times")
@MathML.RenderChar(({ h }) => [h("mo", "&#xD7;")])
export default class Times extends OperatorChar {
  constructor() {
    super("*");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
