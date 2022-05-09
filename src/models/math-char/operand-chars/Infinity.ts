import OperandChar from "../OperandChar";

export default class Infinity extends OperandChar {
  protected _clickable = true;

  constructor() {
    super("infinity");
  }
}
