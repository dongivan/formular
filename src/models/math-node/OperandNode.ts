import type { MathChar, OperandChar } from "../math-char";
import MathNode from "./MathNode";

export default class OperandNode extends MathNode {
  constructor(args: { char: OperandChar; params?: MathChar[][] }) {
    super(args);
  }

  get char() {
    return this._char as OperandChar;
  }
}
