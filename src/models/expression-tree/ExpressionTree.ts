import { BinaryNode, BinaryTree } from "./BinaryTree";
import { LeftParen, RightParen } from "../math-char";
import type { MathChar } from "../math-char";
import { OperatorSymbol } from "../math-symbol";
import type { MathSymbol } from "../math-symbol";
import MathMLNode from "../MathMLNode";
import { LatexSymbolRenderer, MathMLSymbolRenderer } from "../renderer";

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

const RenderLatex = function (
  node: ExpressionNode,
  leftResult: string | undefined,
  rightResult: string | undefined
): string {
  return node.symbol.render(new LatexSymbolRenderer(), leftResult, rightResult);
};

const RenderMathML = function (
  node: ExpressionNode,
  leftResult: Array<MathMLNode> | undefined,
  rightResult: Array<MathMLNode> | undefined
): Array<MathMLNode> {
  return node.symbol.render(
    new MathMLSymbolRenderer(),
    leftResult,
    rightResult
  );
};

class ExpressionNode extends BinaryNode<MathSymbol<MathChar>, ExpressionTree> {
  get symbol(): MathSymbol<MathChar> {
    return this.value;
  }

  setParenLevelRecursively(): [number, number] {
    return this.traverse(SetParenLevel);
  }
}

class ExpressionTree extends BinaryTree<ExpressionNode> {
  renderLatex(): string {
    return this.root?.traverse(RenderLatex) || "";
  }

  renderMathML(): MathMLNode {
    return new MathMLNode("math", {
      attrs: { display: "block" },
      children: this.root?.traverse(RenderMathML) || [],
    });
  }
}

export { ExpressionNode, ExpressionTree };
