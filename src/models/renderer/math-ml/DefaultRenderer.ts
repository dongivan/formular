import { MathChar } from "../../math-char";
import { MathSymbol, OperatorSymbol } from "../../math-symbol";
import SymbolRenderer from "../SymbolRenderer";
import MathMLNode from "../../MathMLNode";
import CharRenderer from "./CharRenderer";

export default class DefaultRenderer extends SymbolRenderer<MathMLNode[]> {
  protected _charRenderer = new CharRenderer();

  renderOperand(symbol: MathSymbol<MathChar>): MathMLNode[] {
    const children = symbol.params.map<MathMLNode>((param) => {
      const row = new MathMLNode("mrow");
      const infix = this._formula.infixMaker.make(param);
      const postfix = this._formula.postfixMaker.make(infix);
      const tree = this._formula.binaryTreeMaker.make(postfix);
      row.children = tree.renderMathML().children;
      return row;
    });
    return [this._charRenderer.render(symbol.char, children)];
  }

  renderOperator(
    symbol: OperatorSymbol,
    leftOperand: MathMLNode[] | undefined,
    rightOperand: MathMLNode[] | undefined
  ): MathMLNode[] {
    const result: MathMLNode[] = [];
    result.push(...(leftOperand || []));
    result.push(...this.renderOperand(symbol));
    result.push(...(rightOperand || []));
    return result;
  }
}
