import { replace } from "../../../utils";
import { MathChar } from "../../../math-char";
import { MathSymbol, OperatorSymbol } from "../../../math-symbol";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

function renderOperandLatex(
  template: string,
  operandLatex: string | undefined
) {
  return operandLatex ? replace(template, operandLatex) : "";
}

export default {
  operandRenderer: (
    symbol: MathSymbol<MathChar>,
    renderer: SymbolRenderer
  ): string => {
    const latexParams = symbol.params.map<string>((param) => {
      const infix = renderer.formula.infixMaker.make(param);
      const postfix = renderer.formula.postfixMaker.make(infix);
      const tree = renderer.formula.binaryTreeMaker.make(postfix);
      return tree.renderLatex();
    });
    return renderer.charRenderer.render(symbol.char, latexParams);
  },
  operatorRenderer: (
    symbol: OperatorSymbol,
    leftOperand: string | undefined,
    rightOperand: string | undefined,
    renderer: SymbolRenderer
  ): string => {
    return (
      renderOperandLatex(symbol.char.leftOperandLatexTemplate, leftOperand) +
      renderer.renderOperand(symbol) +
      renderOperandLatex(symbol.char.rightOperandLatexTemplate, rightOperand)
    );
  },
} as SymbolRendererFunction<string>;
