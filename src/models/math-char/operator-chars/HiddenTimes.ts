import { Latex, MathML, WolframAlpha } from "../../renderer";
import { OperatorChar } from "../internal";

@Latex.RenderChar(() => "")
@MathML.RenderChar(() => [])
@WolframAlpha.RenderChar(() => "*")
export default class HiddenTimes extends OperatorChar {
  constructor() {
    super("·");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
