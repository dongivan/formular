import { Latex, MathML } from "../../Renderer";
import { OperatorChar } from "../internal";

@Latex.RenderChar(() => "")
@MathML.RenderChar(() => [])
export default class HiddenTimes extends OperatorChar {
  constructor() {
    super("·");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
