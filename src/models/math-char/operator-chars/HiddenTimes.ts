import { MMLHiddenRenderer } from "../../renderer";
import OperatorChar from "../OperatorChar";

export default class HiddenTimes extends OperatorChar {
  readonly mmlRenderer = MMLHiddenRenderer;
  protected _latexTemplate = "";

  constructor() {
    super("·");
    this._priority = 2;
  }
}
