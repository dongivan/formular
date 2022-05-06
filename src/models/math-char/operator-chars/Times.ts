import OperatorChar from "../OperatorChar";

export default class Times extends OperatorChar {
  protected _mmlValueTemplate = "&#xD7;";

  constructor() {
    super("\\times");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
