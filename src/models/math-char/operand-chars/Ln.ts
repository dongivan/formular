import OperandChar from "../OperandChar";

export default class Ln extends OperandChar {
  protected _clickable = true;
  protected _paramsNumber = 1;
  protected _paramsParen = 1;

  constructor() {
    super("ln");
  }
}
