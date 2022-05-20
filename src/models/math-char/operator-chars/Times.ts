import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.RegisterMathChar("*", "times", "multiple")
@Latex.RenderChar(() => "\\times")
@MathML.RenderChar(({ h }) => [h("mo", "&#xD7;")])
export default class Times extends OperatorChar {
  constructor() {
    super("*");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
