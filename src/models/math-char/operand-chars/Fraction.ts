import OperandChar from "../OperandChar";

export default class Fraction extends OperandChar {
  constructor() {
    super("frac");
    this._paramsNumber = 2;
  }
}
