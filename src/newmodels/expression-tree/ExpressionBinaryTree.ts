import SymbolFactory from "../SymbolFactory";
import ExpressionNode from "./ExpressionNode";
import Operand from "./Operand";
import Operator from "./Operator";
import PostfixExpression from "./PostfixExpression";

export default class ExpressionBinaryTree {
  root: ExpressionNode;

  constructor(postfix: PostfixExpression) {
    this.root = this._parsePostfixToBinaryTree(postfix);
    this.root.setParenLevelRecursively();
  }

  private _parsePostfixToBinaryTree(
    postfix: PostfixExpression
  ): ExpressionNode {
    let root: ExpressionNode | undefined = undefined;
    const list = postfix.list;

    const stack: ExpressionNode[] = [];
    let pos = 0;
    while (pos < list.length) {
      const oper = list[pos];
      const node = new ExpressionNode(oper);
      if (oper instanceof Operand) {
        stack.push(node);
      } else if (oper instanceof Operator) {
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

    if (root == undefined) {
      root = new ExpressionNode(new Operand(SymbolFactory.createPlaceholder()));
    }

    return root;
  }

  renderLatex(): string {
    return this.root.renderLatex();
  }
}
