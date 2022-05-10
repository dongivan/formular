import { IIntegral } from "../../../math-char";
import { OperandSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: OperandSymbol<IIntegral>,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const parameters = SymbolRenderer.renderParameters(symbol, renderer);
    return [
      renderer.charRenderer.render(symbol.char),
      parameters[0],
      new MathMLNode("mi", { value: "d" }),
      parameters[1],
    ];
  },
} as SymbolRendererFunction<MathMLNode[]>;
