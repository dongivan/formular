import Operator from "../OperatorChar";

export default class Minus extends Operator {
  protected _mmlValueTemplate = "&#x2212;";

  constructor() {
    super("-");
    this._priority = 1;
  }
}
