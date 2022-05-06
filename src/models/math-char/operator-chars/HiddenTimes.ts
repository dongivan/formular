import { MMLHiddenRenderer } from "../../renderer";
import OperatorChar from "../OperatorChar";

export default class HiddenTimes extends OperatorChar {
  readonly mmlRenderer = MMLHiddenRenderer;

  constructor() {
    super("·");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
