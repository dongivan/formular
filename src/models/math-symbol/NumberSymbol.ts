import { MathChar, OperandChar, DecimalPoint, NumberChar } from "../math-char";
import OperandSymbol from "./OperandSymbol";

export default class NumberSymbol<
  C extends NumberChar | DecimalPoint
> extends OperandSymbol<OperandChar> {
  constructor(char: C, params?: MathChar[][]) {
    super(char, params);
  }
}
