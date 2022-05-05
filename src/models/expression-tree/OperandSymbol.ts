import MathChar from "../MathChar";
import OperandChar from "../OperandChar";
import MathSymbol from "./MathSymbol";

export default class OperandSymbol<
  O extends OperandChar
> extends MathSymbol<OperandChar> {
  constructor(char: O, params?: MathChar[][]) {
    super(char, params);
  }
}
