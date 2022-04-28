import ExpressionBinaryTree from "./ExpressionBinaryTree";
import InfixExpression from "./InfixExpression";
import Operator from "./Operator";
import PostfixExpression from "./PostfixExpression";
import SymbolGroup from "./SymbolGroup";

export default class ExpressionNode {
  value: SymbolGroup;
  leftChild: ExpressionNode | undefined;
  rightChild: ExpressionNode | undefined;

  constructor(value: SymbolGroup) {
    this.value = value;
  }

  renderLatex(): string {
    let latex = "";
    if (this.leftChild) {
      const leftChildLatex = this.leftChild.renderLatex();
      latex +=
        this.value instanceof Operator
          ? this.value.symbol.renderLatexOfLeftOperand(leftChildLatex)
          : leftChildLatex;
    }
    latex += this._renderLatex();
    if (this.rightChild) {
      const rightChildLatex = this.rightChild.renderLatex();
      latex +=
        this.value instanceof Operator
          ? this.value.symbol.renderLatexOfRightOperand(rightChildLatex)
          : rightChildLatex;
    }
    return latex;
  }

  private _renderLatex(): string {
    const symbols = this.value.symbols;
    if (symbols.length > 1) {
      return symbols.map<string>((number) => number.renderLatex()).join("");
    } else {
      const symbol = symbols[0];
      if (symbol) {
        const params: string[] =
          symbol.paramsNumber > 0
            ? this.value.params.map<string>((param) => {
                const infix = new InfixExpression(param);
                const postfix = new PostfixExpression(infix);
                const tree = new ExpressionBinaryTree(postfix);
                return tree.renderLatex();
              })
            : [];
        return symbol.renderLatex(params);
      }
      return "";
    }
  }
}
