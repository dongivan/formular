import { MathChar } from "../../math-char";
import { MathSymbol, OperatorSymbol } from "../../math-symbol";
import { replace } from "../../utils";
import Renderer from "../Renderer";

export default class DefaultRenderer extends Renderer<string> {
  renderOperand(symbol: MathSymbol<MathChar>): string {
    let result = symbol.char.latexTemplate;
    if (symbol.hasParams) {
      const latexParams = symbol.params.map<string>((param) => {
        const infix = this._formula.infixMaker.make(param);
        const postfix = this._formula.postfixMaker.make(infix);
        const tree = this._formula.binaryTreeMaker.make(postfix);
        return tree.renderLatex();
      });
      if (latexParams) {
        result = replace(result, latexParams);
      }
    }
    if (symbol.char.clickable) {
      result = replace(symbol.char.clickableLatexTemplate, {
        SN: symbol.char.sequenceNumber.toString(),
        LATEX: result,
      });
    }
    return result;
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
