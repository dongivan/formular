import OperandChar from "../OperandChar";

export default class NumberChar extends OperandChar {
  protected _clickable = true;

  constructor(value: number) {
    super(value.toString());
  }
}
