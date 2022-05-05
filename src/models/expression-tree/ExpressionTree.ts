import Formula from "../Formula";
import { LeftParen, RightParen } from "../operator-chars";
import { BinaryNode, BinaryTree } from "./BinaryTree";
import OperatorSymbol from "./OperatorSymbol";
import MathSymbol from "./MathSymbol";
import MathChar from "../MathChar";

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
  return node.symbol.renderLatex(
    (params) =>
      params.map<string>((param) => {
        const infix = node.tree.formula.infixMaker.make(param);
        const postfix = node.tree.formula.postfixMaker.make(infix);
        const tree = node.tree.formula.binaryTreeMaker.make(postfix);
        return tree.renderLatex();
      }),
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
}

export { ExpressionNode, ExpressionTree };
