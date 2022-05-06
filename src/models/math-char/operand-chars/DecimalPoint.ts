import OperandChar from "../OperandChar";

export default class DecimalPoint extends OperandChar {
  protected _clickable = true;

  constructor() {
    super(".");
  }
}
