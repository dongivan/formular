import OperandSymbol from "../OperandSymbol";

export default class NumberSymbol extends OperandSymbol {
  protected _clickable = true;

  constructor(value: number) {
    super(value.toString());
  }

  concat(number: NumberSymbol) {
    this._value += number._value;
  }
}
