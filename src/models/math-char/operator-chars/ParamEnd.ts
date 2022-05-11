import { OperatorChar } from "../internal";

export default class ParamEnd extends OperatorChar {
  constructor() {
    super("#");
    this._hasRightOperand = false;
  }
}
