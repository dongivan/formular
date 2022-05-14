import Formula from "../Formula";
import ExpressionTree from "./ExpressionTree";
import { MathSymbol, OperandSymbol, OperatorSymbol } from "../math-symbol";
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
    let root: MathSymbol | undefined = undefined;

    if (postfix.length == 0) {
      throw new Error("Create expression tree failed: postfix array is empty.");
    }
    const stack: MathSymbol[] = [];
    let pos = 0;
    while (pos < postfix.length) {
      const symbol = postfix[pos];
      if (symbol instanceof OperandSymbol) {
        stack.push(symbol);
      } else if (symbol instanceof OperatorSymbol) {
        if (symbol.hasRightOperand) {
          const rightChild = stack.pop();
          if (rightChild) {
            symbol.rightChild = rightChild;
          }
        }
        if (symbol.hasLeftOperand) {
          const leftChild = stack.pop();
          if (leftChild) {
            symbol.leftChild = leftChild;
          }
        }
        stack.push(symbol);
      }
      symbol.paramTrees = symbol.params.map<ExpressionTree>((param, i) => {
        return this.formula.generateExpressionTree(
          param,
          symbol.char.hasParamParen(i)
        );
      });
      root = symbol;

      pos += 1;
    }
    if (!root) {
      throw new Error(
        "Create expression tree failed: create root node failed."
      );
    }
    if (addParen) {
      const [left, right] = this.formula.charFactory.createTempParen();
      const rightNode = new OperatorSymbol({ char: right }),
        leftNode = new OperatorSymbol({ char: left });
      rightNode.leftChild = root;
      leftNode.rightChild = rightNode;
      root = leftNode;
    }
    root.setParenLevels();
    const tree = new ExpressionTree(root);
    return tree;
  }
}
