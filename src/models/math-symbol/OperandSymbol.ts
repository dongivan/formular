import type { MathChar, OperandChar } from "../math-char";
import MathSymbol from "./MathSymbol";

export default class OperandSymbol extends MathSymbol {
  constructor(args: { char: OperandChar; params?: MathChar[][] }) {
    super(args);
  }

  get char() {
    return this._char as OperandChar;
  }
}
