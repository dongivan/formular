import OperatorChar from "../OperatorChar";

export default class HiddenTimes extends OperatorChar {
  constructor() {
    super("·");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
