import type { MathNode } from "../math-node";

export default class ExpressionTree {
  root: MathNode;

  constructor(root: MathNode) {
    this.root = root;
  }
}
