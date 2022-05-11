import type { ExpressionTree } from "../expression-tree";
import type { MathChar } from "../math-char";
import type { SymbolRenderer } from "../renderer";

export default abstract class MathSymbol<M extends MathChar> {
  protected _char: M;
  // protected _params: MathChar[][] = [];
  protected _paramTrees: ExpressionTree[];

  // constructor(char: M, params?: MathChar[][]) {
  //   this._char = char;
  //   this._params = params || [];
  // }

  constructor(char: M, paramTrees?: ExpressionTree[]) {
    this._char = char;
    this._paramTrees = paramTrees || [];
  }

  get char(): M {
    return this._char;
  }

  get paramTrees() {
    return this._paramTrees;
  }
  // set params(groups: MathChar[][]) {
  //   this._params = groups;
  // }

  // get params(): MathChar[][] {
  //   return this._params;
  // }

  get hasParams(): boolean {
    return this.paramTrees.length > 0;
  }

  // get hasParams(): boolean {
  //   return this._params.length > 0;
  // }

  render<R>(
    renderer: SymbolRenderer<R>,
    leftOperand: R | undefined,
    rightOperand: R | undefined
  ): R {
    return renderer.render(this, leftOperand, rightOperand);
  }

  toString(): string {
    return (
      this._char.toString() +
      (this.paramTrees.length > 0
        ? "(" +
          this.paramTrees
            .map<string>((paramTree) =>
              paramTree.root
                ? paramTree.root.traverse((node, left, right) => {
                    return (
                      (left ? `${left}, ` : "") +
                      node.symbol.char.toString() +
                      (right ? `, ${right}` : "")
                    );
                  })
                : ""
            )
            .join("; ") +
          ")"
        : "")
    );
  }

  // toString(): string {
  //   return (
  //     this._char.toString() +
  //     (this._params.length > 0
  //       ? "(" +
  //         this.params.map<string>((param) =>
  //           param.map<string>((group) => group.toString()).join(", ")
  //         ) +
  //         ")"
  //       : "")
  //   );
  // }
}
