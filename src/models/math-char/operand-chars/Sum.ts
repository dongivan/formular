import OperandChar from "../OperandChar";

export default class Sum extends OperandChar {
  protected _paramsNumber = 4;
  protected _paramsParen = 1 << 3;

  constructor() {
    super("sum");
  }
}
