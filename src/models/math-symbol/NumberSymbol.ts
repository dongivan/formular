import { MathChar, OperandChar, DecimalPoint, Digit } from "../math-char";
import OperandSymbol from "./OperandSymbol";

export default class NumberSymbol<
  C extends Digit | DecimalPoint
> extends OperandSymbol<OperandChar> {
  constructor(char: C, params?: MathChar[][]) {
    super(char, params);
  }
}
