import Formula from "../Formula";
import { ExpressionTree, ExpressionNode } from "./ExpressionTree";
import { OperandSymbol, OperatorSymbol } from "../math-symbol";
import type PostfixList from "./PostfixList";
import Instance from "../InstanceResolver";

export default class ExpressionTreeMaker extends Instance {
  make(postfix: PostfixList, addParen = false) {
    return this._parsePostfixToBinaryTree(postfix, addParen);
  }

  private _parsePostfixToBinaryTree(
    postfix: PostfixList,
    addParen: boolean
  ): ExpressionTree {
    const tree = new ExpressionTree();
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
    if (addParen) {
      const [left, right] =
        this.getTrackedRelated<Formula>(Formula).charFactory.createTempParen();
      const rightNode = new ExpressionNode(tree, new OperatorSymbol(right)),
        leftNode = new ExpressionNode(tree, new OperatorSymbol(left));
      rightNode.leftChild = root;
      leftNode.rightChild = rightNode;
      root = leftNode;
    }
    if (root) {
      root.setParenLevelRecursively();
    }
    tree.root = root;
    return tree;
  }
}
