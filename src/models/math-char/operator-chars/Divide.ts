import OperatorChar from "../OperatorChar";

export default class Divide extends OperatorChar {
  protected _mmlValueTemplate = "&#xF7;";

  constructor() {
    super("\\div");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
