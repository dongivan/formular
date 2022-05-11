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
    const parameters = SymbolRenderer.renderParameters(symbol);
    return [renderer.charRenderer.render(symbol.char), ...parameters];
  },
} as SymbolRendererFunction<MathMLNode[]>;
