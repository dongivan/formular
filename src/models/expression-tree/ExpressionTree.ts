import Formula from "../Formula";
import { LeftParen, RightParen } from "../operator-symbols";
import { BinaryNode, BinaryTree } from "./BinaryTree";
import Operator from "./Operator";
import SymbolGroup from "./SymbolGroup";

const SetParenLevel = function (
  node: ExpressionNode,
  leftResult: [number, number] = [0, 0],
  rightResult: [number, number] = [0, 0]
): [number, number] {
  const parenCounts: [number, number] = [
    Math.max(leftResult[0], rightResult[0]),
    Math.max(leftResult[1], rightResult[1]),
  ];
  if (node.value instanceof Operator) {
    if (node.value.symbol instanceof LeftParen) {
      node.value.symbol.level = parenCounts[0];
      parenCounts[0] += 1;
    } else if (node.value.symbol instanceof RightParen) {
      node.value.symbol.level = parenCounts[1];
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
  let latex = "";
  if (leftResult) {
    latex +=
      node.value instanceof Operator
        ? node.value.symbol.renderLatexOfLeftOperand(leftResult)
        : leftResult;
  }

  const symbols = node.value.symbols;
  if (symbols.length > 1) {
    latex += symbols.map<string>((number) => number.renderLatex()).join("");
  } else {
    const symbol = symbols[0];
    if (symbol) {
      const params: string[] =
        symbol.paramsNumber > 0
          ? node.value.params.map<string>((param) => {
              const infix = node.tree.formula.infixMaker.make(param);
              const postfix = node.tree.formula.postfixMaker.make(infix);
              const tree = node.tree.formula.binaryTreeMaker.make(postfix);
              return tree.renderLatex();
            })
          : [];
      latex += symbol.renderLatex(params);
    }
    latex += "";
  }

  if (rightResult) {
    latex +=
      node.value instanceof Operator
        ? node.value.symbol.renderLatexOfRightOperand(rightResult)
        : rightResult;
  }
  return latex;
};

class ExpressionNode extends BinaryNode<SymbolGroup, ExpressionTree> {
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
