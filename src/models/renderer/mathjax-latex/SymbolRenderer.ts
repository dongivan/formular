import { MathChar } from "../../math-char";
import { MathSymbol, OperatorSymbol } from "../../math-symbol";
import { replace } from "../../utils";
import BaseSymbolRenderer from "../SymbolRenderer";
import CharRenderer from "./CharRenderer";

export default class SymbolRenderer extends BaseSymbolRenderer<string> {
  protected _charRenderer = new CharRenderer();

  get charRenderer(): CharRenderer {
    return this._charRenderer;
  }

  renderOperand(symbol: MathSymbol<MathChar>): string {
    const latexParams = symbol.params.map<string>((param) => {
      const infix = this._formula.infixMaker.make(param);
      const postfix = this._formula.postfixMaker.make(infix);
      const tree = this._formula.binaryTreeMaker.make(postfix);
      return tree.renderLatex();
    });
    return this._charRenderer.render(symbol.char, latexParams);
  }

  renderOperator(
    symbol: OperatorSymbol,
    leftOperand: string | undefined,
    rightOperand: string | undefined
  ): string {
    return (
      this._renderOperandLatex(
        symbol.char.leftOperandLatexTemplate,
        leftOperand
      ) +
      this.renderOperand(symbol) +
      this._renderOperandLatex(
        symbol.char.rightOperandLatexTemplate,
        rightOperand
      )
    );
  }

  private _renderOperandLatex(
    template: string,
    operandLatex: string | undefined
  ) {
    return operandLatex ? replace(template, operandLatex) : "";
  }
}
