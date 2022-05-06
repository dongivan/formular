import Formula from "../Formula";
import { LeftParen, RightParen, MathChar } from "../math-char";
import { BinaryNode, BinaryTree } from "./BinaryTree";
import { OperatorSymbol, MathSymbol } from "../math-symbol";
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
  return node.symbol.render(
    new LatexSymbolRenderer(node.tree.formula),
    leftResult,
    rightResult
  );
};

const RenderMathML = function (
  node: ExpressionNode,
  leftResult: Array<MathMLNode> | undefined,
  rightResult: Array<MathMLNode> | undefined
): Array<MathMLNode> {
  return node.symbol.render(
    new MathMLSymbolRenderer(node.tree.formula),
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
  formula: Formula;

  constructor(formula: Formula) {
    super();
    this.formula = formula;
  }

  renderLatex(): string {
    return this.root?.traverse(RenderLatex) || "";
  }

  renderMathML(): MathMLNode {
    const rootEle = new MathMLNode("math");
    rootEle.children = this.root?.traverse(RenderMathML) || [];
    return rootEle;
  }
}

export { ExpressionNode, ExpressionTree };
