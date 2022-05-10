import OperandChar from "../OperandChar";

export default class Limit extends OperandChar {
  protected _paramsNumber = 3;
  protected _paramsParen = 1 << 2;

  constructor() {
    super("limit");
  }
}
