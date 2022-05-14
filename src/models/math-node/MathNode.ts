import { ExpressionTree } from "../expression-tree";
import { LeftParen, MathChar, RightParen } from "../math-char";

export default abstract class MathNode {
  protected _char: MathChar;
  protected _params: MathChar[][] = [];

  private _paramTrees: ExpressionTree[] | undefined;
  leftChild: MathNode | undefined;
  rightChild: MathNode | undefined;

  constructor(args: { char: MathChar; params?: MathChar[][] }) {
    this._char = args.char;
    this._params = args.params || [];
  }

  get char(): MathChar {
    return this._char;
  }

  get params(): MathChar[][] {
    return this._params;
  }

  get paramTrees() {
    return this._paramTrees || [];
  }

  set paramTrees(val: ExpressionTree[]) {
    this._paramTrees = val;
  }

  setParenLevels() {
    const leftResult = this.leftChild?.setParenLevels() || [0, 0],
      rightResult = this.rightChild?.setParenLevels() || [0, 0];
    const parenCounts: [number, number] = [
      Math.max(leftResult[0], rightResult[0]),
      Math.max(leftResult[1], rightResult[1]),
    ];
    if (this.char instanceof LeftParen) {
      this.char.level = parenCounts[0];
      parenCounts[0] += 1;
    } else if (this.char instanceof RightParen) {
      this.char.level = parenCounts[1];
      parenCounts[1] += 1;
    }
    return parenCounts;
  }

  toString(): string {
    return (
      this._char.toString() +
      (this._params.length > 0
        ? "(" +
          this.params.map<string>((param) =>
            param.map<string>((group) => group.toString()).join(", ")
          ) +
          ")"
        : "")
    );
  }
}
