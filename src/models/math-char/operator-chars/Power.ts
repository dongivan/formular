import { MMLPowerRenderer } from "../../renderer";
import OperatorChar from "../OperatorChar";

export default class Power extends OperatorChar {
  protected _leftOperandLatexTemplate = "{<0>}";

  readonly mmlRenderer = MMLPowerRenderer;

  constructor() {
    super("^");
    this._priority = OperatorChar.Priorities.Exponentiation;
    this._hasRightOperand = false;
    this._paramsNumber = 1;
  }
}
