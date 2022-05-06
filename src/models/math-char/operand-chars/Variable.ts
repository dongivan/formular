import OperandChar from "../OperandChar";

export default class Variable extends OperandChar {
  protected _clickable = true;

  constructor(value: string) {
    super(value);
  }
}
