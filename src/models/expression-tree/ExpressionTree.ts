import type { MathSymbol } from "../math-symbol";

export default class ExpressionTree {
  root: MathSymbol;

  constructor(root: MathSymbol) {
    this.root = root;
  }
}
