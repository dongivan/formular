import { BinaryNode, BinaryTree } from "./BinaryTree";
import { LeftParen, RightParen } from "../math-char";
import type { MathChar } from "../math-char";
import { OperatorSymbol } from "../math-symbol";
import type { MathSymbol } from "../math-symbol";

const SetParenLevel = function (
  node: ExpressionNode,
  leftResult: [number, number] = [0, 0],
  rightResult: [number, number] = [0, 0]
): [number, number] {
  const parenCounts: [number, number] = [
    Math.max(leftResult[0], rightResult[0]),
    Math.max(leftResult[1], rightResult[1]),
  ];
  if (node.symbol instanceof OperatorSymbol) {
    if (node.symbol.char instanceof LeftParen) {
      node.symbol.char.level = parenCounts[0];
      parenCounts[0] += 1;
    } else if (node.symbol.char instanceof RightParen) {
      node.symbol.char.level = parenCounts[1];
      parenCounts[1] += 1;
    }
  }
  return parenCounts;
};

class ExpressionNode extends BinaryNode<MathSymbol<MathChar>, ExpressionTree> {
  get symbol(): MathSymbol<MathChar> {
    return this.value;
  }

  setParenLevelRecursively(): [number, number] {
    return this.traverse(SetParenLevel);
  }
}

class ExpressionTree extends BinaryTree<ExpressionNode> {}

export { ExpressionNode, ExpressionTree };
