import Formula from "../Formula";
import { ExpressionTree, ExpressionNode } from "./ExpressionTree";
import OperandSymbol from "./OperandSymbol";
import OperatorSymbol from "./OperatorSymbol";
import PostfixList from "./PostfixList";

export default class ExpressionTreeMaker {
  private _formula: Formula;

  constructor(formula: Formula) {
    this._formula = formula;
  }

  make(postfix: PostfixList) {
    return this._parsePostfixToBinaryTree(postfix);
  }

  private _parsePostfixToBinaryTree(postfix: PostfixList): ExpressionTree {
    const tree = new ExpressionTree(this._formula);
    let root: ExpressionNode | undefined = undefined;

    const stack: ExpressionNode[] = [];
    let pos = 0;
    while (pos < postfix.length) {
      const oper = postfix[pos];
      const node = new ExpressionNode(tree, oper);
      if (oper instanceof OperandSymbol) {
        stack.push(node);
      } else if (oper instanceof OperatorSymbol) {
        if (oper.hasRightOperand) {
          const rightChild = stack.pop();
          if (rightChild) {
            node.rightChild = rightChild;
          }
        }
        if (oper.hasLeftOperand) {
          const leftChild = stack.pop();
          if (leftChild) {
            node.leftChild = leftChild;
          }
        }
        stack.push(node);
      }
      root = node;

      pos += 1;
    }
    if (root) {
      root.setParenLevelRecursively();
    }
    tree.root = root;
    return tree;
  }
}
