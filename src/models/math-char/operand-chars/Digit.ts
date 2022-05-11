import { OperandChar } from "../internal";

export default class Digit extends OperandChar {
  protected _clickable = true;

  constructor(value: string) {
    super(value.toString());
  }
}
