import { MathMLHiddenRenderer } from "../../renderer";
import OperatorChar from "../OperatorChar";

export default class HiddenTimes extends OperatorChar {
  readonly mathMLRenderer = MathMLHiddenRenderer;

  constructor() {
    super("·");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
