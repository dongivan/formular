import OperandChar from "../OperandChar";

export default class SquareRoot extends OperandChar {
  constructor() {
    super("sqrt");
    this._paramsNumber = 1;
  }
}
