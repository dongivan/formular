import { LeftParen, MathChar, RightParen } from "../math-char";
import type { MathTree } from "../math-tree";

type MathNodeConstructorArgs = {
  char: MathChar;
  params?: MathChar[][];
  [key: string]: unknown;
};

export default class MathNode {
  protected _char: MathChar;
  protected _params: MathChar[][] = [];

  leftChild: MathNode | undefined;
  rightChild: MathNode | undefined;
  paramTrees: MathTree[] | undefined;

  constructor(args: MathNodeConstructorArgs) {
    this._char = args.char;
    this._params = args.params || [];
  }

  get char(): MathChar {
    return this._char;
  }

  get params(): MathChar[][] {
    return this._params;
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

  protected _reuse(args: MathNodeConstructorArgs) {
    if (this._char !== args.char) {
      throw new Error(
        "Update MathNode failed: `_char` does not equals `args.char`."
      );
    }
    this.leftChild = undefined;
    this.rightChild = undefined;
    if (this._params !== args.params) {
      this._params = args.params || [];
    }
  }

  /**
   * Create `MathNode` object.
   *
   * The old infix list (`reuse?: MathNode[]`) could be reused when it has the same `char` with `args.char`.
   * However, the reused `MathNode` object WILL BE REMOVED from `reuse` array.
   *
   * @param this The pointer to current class so that `create` could `new` a appropriate class which extends MathNode. It will be set automatically.
   * @param args The same type with the parameters of the class constructor.
   * @param reuse The infix list of the `MathNode`. Be careful, it will be changed if the item of it is used.
   * @returns new `MathNode` object or reused `MathNode` object.
   */
  static create<T extends typeof MathNode>(
    this: T,
    args: MathNodeConstructorArgs,
    reuse?: MathNode[]
  ): InstanceType<T> {
    if (reuse) {
      const index = reuse.findIndex((old) => old._char == args.char);
      if (index > -1) {
        /* Caution: a infinite loop will be launched if a `MathNode` with a `OperandChar` char is reused more than one time.
        For example: `2a` will have a infix list like `2.a` (`2` is a `IntegerNode` with `Digit` char, `a` is `OperandNode`
        with `Variable` char, and `.` is `OperatorNode` with `HiddenTimes` char), the `.` char will be reused in
        `MathCharFactory`, and then the first `.` `MathNode` will be reused twice when the infix list changes to `2ab`, so
        that the tree become to "(2-.-a)-.-b" and the two `.` nodes who acually are the same node (`.` is the left child of
        itself) will launch a infinite loop.
        So the reused node must be removed from the reuse list to prevent reusing more than one time.
        */
        const node = reuse.splice(index, 1)[0];
        node._reuse(args);
        return node as InstanceType<T>;
      }
    }
    return new this(args) as InstanceType<T>;
  }
}
