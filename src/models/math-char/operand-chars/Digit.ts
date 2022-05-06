import OperandChar from "../OperandChar";

export default class Digit extends OperandChar {
  protected _clickable = true;

  constructor(value: number) {
    super(value.toString());
  }
}
