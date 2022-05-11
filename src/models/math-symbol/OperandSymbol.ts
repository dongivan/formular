import type { ExpressionTree } from "../expression-tree";
import type { OperandChar } from "../math-char";
import MathSymbol from "./MathSymbol";

export default class OperandSymbol<
  O extends OperandChar
> extends MathSymbol<OperandChar> {
  constructor(char: O, paramTrees?: ExpressionTree[]) {
    super(char, paramTrees);
  }
}
