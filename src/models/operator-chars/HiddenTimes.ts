import OperatorChar from "../OperatorChar";

export default class HiddenTimes extends OperatorChar {
  protected _latexTemplate = "";

  constructor() {
    super("·");
    this._priority = 2;
  }
}
