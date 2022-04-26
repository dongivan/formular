import OperandSymbol from "../OperandSymbol";

export default class Number extends OperandSymbol {
  constructor(value: number) {
    super(value.toString());
  }
}
