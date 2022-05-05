import { MathChar, OperatorChar } from "../math-char";
import MathSymbol from "./MathSymbol";

export default class OperatorSymbol extends MathSymbol<OperatorChar> {
  get hasLeftOperand(): boolean {
    return this._char.hasLeftOperand;
  }

  get hasRightOperand(): boolean {
    return this._char.hasRightOperand;
  }

  get hasParams(): boolean {
    return !!this._char.paramsNumber;
  }

  get priority(): number {
    return this._char.priority;
  }

  get char(): OperatorChar {
    return this._char;
  }

  get chars(): MathChar[] {
    return [this._char];
  }
}
