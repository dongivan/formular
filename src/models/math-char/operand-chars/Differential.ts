import OperandChar from "../OperandChar";

export default class Differential extends OperandChar {
  constructor() {
    super("dif");
    this._paramsNumber = 2;
  }
}
