import type { ExpressionTree } from "../expression-tree";
import type { OperandChar, DecimalPoint, Digit } from "../math-char";
import OperandSymbol from "./OperandSymbol";

export default class NumberSymbol<
  C extends Digit | DecimalPoint
> extends OperandSymbol<OperandChar> {
  constructor(char: C, paramTrees?: ExpressionTree[]) {
    super(char, paramTrees);
  }
}
