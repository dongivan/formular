import Formula from "../Formula";
import TreeNode from "./TreeNode";
import Operand from "./Operand";
import Operator from "./Operator";
import PostfixList from "./PostfixList";
import BinaryTree from "./BinaryTree";

export default class BinaryTreeMaker {
  private _formula: Formula;

  constructor(formula: Formula) {
    this._formula = formula;
  }

  make(postfix: PostfixList) {
    return this._parsePostfixToBinaryTree(postfix);
  }

  private _parsePostfixToBinaryTree(postfix: PostfixList): BinaryTree {
    const tree = new BinaryTree(this._formula);
    let root: TreeNode | undefined = undefined;

    const stack: TreeNode[] = [];
    let pos = 0;
    while (pos < postfix.length) {
      const oper = postfix[pos];
      const node = new TreeNode(tree, oper);
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
    if (root) {
      root.setParenLevelRecursively();
    }
    tree.root = root;
    return tree;
  }
}
