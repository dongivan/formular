import Operator from "../OperatorChar";

export default class Divide extends Operator {
  protected _mmlValueTemplate = "&#xF7;";

  constructor() {
    super("\\div");
    this._priority = 2;
  }
}
