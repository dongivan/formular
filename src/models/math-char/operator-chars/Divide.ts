import OperatorChar from "../OperatorChar";

export default class Divide extends OperatorChar {
  constructor() {
    super("/");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
