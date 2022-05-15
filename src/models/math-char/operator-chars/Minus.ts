import { MathML } from "../../Renderer";
import { MathChar, MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.registerMathChar("-", "minus")
@MathML.RenderChar(({ h }) => [h("mo", "&#x2212;")])
export default class Minus extends OperatorChar {
  constructor() {
    super("-");
  }

  adapt(prevChar: MathChar | undefined) {
    if (
      !prevChar ||
      (prevChar instanceof OperatorChar && prevChar.hasRightOperand)
    ) {
      this._priority = OperatorChar.Priorities.Negative;
      this._hasLeftOperand = false;
    } else {
      this._priority = OperatorChar.Priorities.Addition;
      this._hasLeftOperand = true;
    }
  }
}
