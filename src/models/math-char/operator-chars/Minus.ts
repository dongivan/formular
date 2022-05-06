import MathChar from "../MathChar";
import OperatorChar from "../OperatorChar";

export default class Minus extends OperatorChar {
  protected _mmlValueTemplate = "&#x2212;";

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
