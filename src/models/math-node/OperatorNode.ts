import { MathChar, OperatorChar } from "../math-char";
import MathNode from "./MathNode";

export default class OperatorNode extends MathNode {
  constructor(args: { char: OperatorChar; params?: MathChar[][] }) {
    super(args);
  }

  get char() {
    return this._char as OperatorChar;
  }

  get hasLeftOperand(): boolean {
    return this.char.hasLeftOperand;
  }

  get hasRightOperand(): boolean {
    return this.char.hasRightOperand;
  }
}
