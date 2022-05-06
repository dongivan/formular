import OperandChar from "../OperandChar";

export default class Variable extends OperandChar {
  protected _clickable = true;
  readonly mmlTag = "mi";

  constructor(value: string) {
    super(value);
  }
}
