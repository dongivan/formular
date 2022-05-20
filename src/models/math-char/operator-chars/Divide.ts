import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.RegisterMathChar("/", "divide")
@Latex.RenderChar(() => "\\div")
@MathML.RenderChar(({ h }) => [h("mo", "&#xF7;")])
export default class Divide extends OperatorChar {
  constructor() {
    super("/");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
