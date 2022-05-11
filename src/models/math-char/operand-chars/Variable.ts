import { OperandChar } from "../internal";

export default class Variable extends OperandChar {
  protected _clickable = true;

  constructor(value: string) {
    super(value);
  }
}
