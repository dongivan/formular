import OperandChar from "../OperandChar";

export default class Fraction extends OperandChar {
  readonly mmlTag = "mfrac";

  constructor() {
    super("over");
    this._paramsNumber = 2;
  }
}
