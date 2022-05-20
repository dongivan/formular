import type Formula from "../Formula";
import type { MathNode } from "../math-node";
import { OperandNode, OperatorNode } from "../math-node";
import { InstanceResolver } from "../InstanceResolver";
import type { MathChar } from "../math-char";
import { HiddenTimes, LeftParen, Placeholder, RightParen } from "../math-char";
import { Cursor } from "../math-char";

export default class MathTree {
  private _formulaId: string;
  private _addParen = false;
  private _infixList: MathNode[] = [];
  private _root: MathNode | undefined;
  private _hasCursor = false;

  constructor(formula: Formula, addParen: boolean) {
    this._formulaId = formula.instanceId;
    this._addParen = addParen;
  }

  get formula() {
    return InstanceResolver.getTrackedInstance<Formula>(this._formulaId);
  }

  get infixMaker() {
    return this.formula.infixMaker;
  }

  get postfixMaker() {
    return this.formula.postfixMaker;
  }

  get root() {
    return this._root;
  }

  get hasCursor() {
    return this._hasCursor;
  }

  resetInfixList(chars: MathChar[]) {
    this._infixList = this.infixMaker.make(chars, this._infixList);
    this._generateTree();
    this._hasCursor =
      this._infixList.findIndex((node) => node.char instanceof Cursor) > -1;
  }

  private _generateTree() {
    const postfix = this.postfixMaker.make(this._infixList);
    this._parsePostfixToBinaryTree(postfix);
  }

  private _parsePostfixToBinaryTree(postfix: MathNode[]): void {
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
      if (!node.paramTrees) {
        if (node.params.length > 0) {
          const trees: MathTree[] = [];
          node.params.forEach((param, i) => {
            const tree = new MathTree(this.formula, node.char.hasParamParen(i));
            trees.push(tree);
            tree.resetInfixList(param);
          });
          node.paramTrees = trees;
        }
      } else {
        node.paramTrees.forEach((tree, i) => {
          tree.resetInfixList(node.params[i]);
        });
      }
      root = node;

      pos += 1;
    }
    if (!root) {
      throw new Error(
        "Create expression tree failed: create root node failed."
      );
    }
    if (this._addParen) {
      const [left, right] = this.formula.charFactory.createTempParen();
      const rightNode = new OperatorNode({ char: right }),
        leftNode = new OperatorNode({ char: left });
      rightNode.leftChild = root;
      leftNode.rightChild = rightNode;
      root = leftNode;
    }
    root.setParenLevels();
    this._root = root;
  }

  verify() {
    /* check if infix list has a `Placeholder` */
    if (
      this._infixList.findIndex((node) => node.char instanceof Placeholder) > -1
    ) {
      return false;
    }

    /* check if `Cursor` ocuppies a `Placeholder` */
    /* TODO: current logic will FAIL when `Cursor` is on the left of `Minus` */
    const cursorPos = this._infixList.findIndex(
      (node) => node.char instanceof Cursor
    );
    if (cursorPos > -1) {
      if (
        !(
          this._infixList[cursorPos - 1] &&
          this._infixList[cursorPos - 1].char instanceof HiddenTimes
        ) &&
        !(
          this._infixList[cursorPos + 1] &&
          this._infixList[cursorPos + 1].char instanceof HiddenTimes
        )
      ) {
        return false;
      }
    }

    /* check if parentheses are paired. */
    const parens: MathNode[] = [];
    this._infixList.forEach((node) => {
      if (node.char instanceof LeftParen) {
        parens.unshift(node);
      } else if (node.char instanceof RightParen) {
        if (parens[0] && parens[0].char instanceof LeftParen) {
          parens.shift();
        } else {
          parens.unshift(node);
        }
      }
    });
    if (parens.length > 0) {
      return false;
    }

    /* check each nodes */
    for (const node of this._infixList) {
      for (const tree of node.paramTrees || []) {
        if (!tree.verify()) {
          return false;
        }
      }
    }

    return true;
  }
}
