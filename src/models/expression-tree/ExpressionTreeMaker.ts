import Formula from "../Formula";
import ExpressionTree from "./ExpressionTree";
import { MathNode, OperandNode, OperatorNode } from "../math-node";
import type PostfixList from "./PostfixList";
import { Instance } from "../InstanceResolver";

export default class ExpressionTreeMaker extends Instance {
  make(postfix: PostfixList, addParen = false) {
    return this._parsePostfixToBinaryTree(postfix, addParen);
  }

  get formula() {
    return this.getTrackedRelated<Formula>(Formula);
  }

  private _parsePostfixToBinaryTree(
    postfix: PostfixList,
    addParen: boolean
  ): ExpressionTree {
    let root: MathNode | undefined = undefined;

    if (postfix.length == 0) {
      throw new Error("Create expression tree failed: postfix array is empty.");
    }
    const stack: MathNode[] = [];
    let pos = 0;
    while (pos < postfix.length) {
      const node = postfix[pos];
      if (node instanceof OperandNode) {
        stack.push(node);
      } else if (node instanceof OperatorNode) {
        if (node.hasRightOperand) {
          const rightChild = stack.pop();
          if (rightChild) {
            node.rightChild = rightChild;
          }
        }
        if (node.hasLeftOperand) {
          const leftChild = stack.pop();
          if (leftChild) {
            node.leftChild = leftChild;
          }
        }
        stack.push(node);
      }
      node.paramTrees = node.params.map<ExpressionTree>((param, i) => {
        return this.formula.generateExpressionTree(
          param,
          node.char.hasParamParen(i)
        );
      });
      root = node;

      pos += 1;
    }
    if (!root) {
      throw new Error(
        "Create expression tree failed: create root node failed."
      );
    }
    if (addParen) {
      const [left, right] = this.formula.charFactory.createTempParen();
      const rightNode = new OperatorNode({ char: right }),
        leftNode = new OperatorNode({ char: left });
      rightNode.leftChild = root;
      leftNode.rightChild = rightNode;
      root = leftNode;
    }
    root.setParenLevels();
    const tree = new ExpressionTree(root);
    return tree;
  }
}
