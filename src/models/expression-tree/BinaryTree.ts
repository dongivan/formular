import Formula from "../Formula";
import TreeNode from "./TreeNode";

export default class BinaryTree {
  formula: Formula;
  root: TreeNode | undefined;

  constructor(formula: Formula) {
    this.formula = formula;
  }

  renderLatex(): string {
    return this.root?.renderLatex() || "";
  }
}
