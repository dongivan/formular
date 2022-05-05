import Operator from "../OperatorChar";

export default class Times extends Operator {
  protected _mmlValueTemplate = "&#xD7;";

  constructor() {
    super("\\times");
    this._priority = 2;
  }
}
