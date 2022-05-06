import OperatorChar from "../OperatorChar";

export default class Times extends OperatorChar {
  constructor() {
    super("*");
    this._priority = OperatorChar.Priorities.Multiplication;
  }
}
