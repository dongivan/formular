import { LeftParen, RightParen } from "../operator-symbols";
import BinaryTree from "./BinaryTree";
import Operator from "./Operator";
import SymbolGroup from "./SymbolGroup";

export default class TreeNode {
  tree: BinaryTree;
  value: SymbolGroup;
  leftChild: TreeNode | undefined;
  rightChild: TreeNode | undefined;

  constructor(tree: BinaryTree, value: SymbolGroup) {
    this.tree = tree;
    this.value = value;
  }

  renderLatex(): string {
    let latex = "";
    if (this.leftChild) {
      const leftChildLatex = this.leftChild.renderLatex();
      latex +=
        this.value instanceof Operator
          ? this.value.symbol.renderLatexOfLeftOperand(leftChildLatex)
          : leftChildLatex;
    }
    latex += this._renderLatex();
    if (this.rightChild) {
      const rightChildLatex = this.rightChild.renderLatex();
      latex +=
        this.value instanceof Operator
          ? this.value.symbol.renderLatexOfRightOperand(rightChildLatex)
          : rightChildLatex;
    }
    return latex;
  }

  private _renderLatex(): string {
    const symbols = this.value.symbols;
    if (symbols.length > 1) {
      return symbols.map<string>((number) => number.renderLatex()).join("");
    } else {
      const symbol = symbols[0];
      if (symbol) {
        const params: string[] =
          symbol.paramsNumber > 0
            ? this.value.params.map<string>((param) => {
                const infix = this.tree.formula.infixMaker.make(param);
                const postfix = this.tree.formula.postfixMaker.make(infix);
                const tree = this.tree.formula.binaryTreeMaker.make(postfix);
                return tree.renderLatex();
              })
            : [];
        return symbol.renderLatex(params);
      }
      return "";
    }
  }

  setParenLevelRecursively(): [number, number] {
    const leftChildCounts: [number, number] =
      this.leftChild?.setParenLevelRecursively() || [0, 0];
    const rightChildCounts: [number, number] =
      this.rightChild?.setParenLevelRecursively() || [0, 0];
    const parenCounts: [number, number] = [
      Math.max(leftChildCounts[0], rightChildCounts[0]),
      Math.max(leftChildCounts[1], rightChildCounts[1]),
    ];
    if (this.value instanceof Operator) {
      if (this.value.symbol instanceof LeftParen) {
        this.value.symbol.level = parenCounts[0];
        parenCounts[0] += 1;
      } else if (this.value.symbol instanceof RightParen) {
        this.value.symbol.level = parenCounts[1];
        parenCounts[1] += 1;
      }
    }
    return parenCounts;
  }
}
