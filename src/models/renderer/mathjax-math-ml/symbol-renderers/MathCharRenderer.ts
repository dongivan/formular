import { MathChar } from "../../../math-char";
import { MathSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: MathSymbol<MathChar>,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const parameters = SymbolRenderer.renderParameters(symbol, renderer);
    return [renderer.charRenderer.render(symbol.char, parameters)];
  },
  operatorRenderer: (
    symbol: MathSymbol<MathChar>,
    leftOperand: MathMLNode[] | undefined,
    rightOperand: MathMLNode[] | undefined,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const result: MathMLNode[] = [];
    result.push(...(leftOperand || []));
    result.push(...renderer.renderOperand(symbol));
    result.push(...(rightOperand || []));
    return result;
  },
} as SymbolRendererFunction<MathMLNode[]>;
