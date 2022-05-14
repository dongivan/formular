import { OperatorChar } from "../math-char";
import MathSymbol from "./MathSymbol";

export default class OperatorSymbol extends MathSymbol<OperatorChar> {
  get hasLeftOperand(): boolean {
    return this._char.hasLeftOperand;
  }

  get hasRightOperand(): boolean {
    return this._char.hasRightOperand;
  }
}
