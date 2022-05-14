import Formula from "../Formula";
import { ExpressionTree, ExpressionNode } from "./ExpressionTree";
import { OperandSymbol, OperatorSymbol } from "../math-symbol";
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
    let root: ExpressionNode | undefined = undefined;

    if (postfix.length == 0) {
      throw new Error("Create expression tree failed: postfix array is empty.");
    }
    const stack: ExpressionNode[] = [];
    let pos = 0;
    while (pos < postfix.length) {
      const oper = postfix[pos];
      const node = new ExpressionNode(oper);
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
      node.paramTrees = node.symbol.params.map<ExpressionTree>((param, i) => {
        return this.formula.generateExpressionTree(
          param,
          node.symbol.char.hasParamParen(i)
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
      const rightNode = new ExpressionNode(new OperatorSymbol({ char: right })),
        leftNode = new ExpressionNode(new OperatorSymbol({ char: left }));
      rightNode.leftChild = root;
      leftNode.rightChild = rightNode;
      root = leftNode;
    }
    root.setParenLevelRecursively();
    const tree = new ExpressionTree(root);
    return tree;
  }
}
