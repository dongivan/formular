import MathChar from "../math-char/MathChar";
import OperandChar from "../math-char/OperandChar";
import MathSymbol from "./MathSymbol";

export default class OperandSymbol<
  O extends OperandChar
> extends MathSymbol<OperandChar> {
  constructor(char: O, params?: MathChar[][]) {
    super(char, params);
  }
}
