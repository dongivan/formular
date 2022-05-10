import { Combination } from "../../../math-char";
import { OperandSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: OperandSymbol<Combination>,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const parameters = SymbolRenderer.renderParameters(symbol, renderer);
    return [
      new MathMLNode("msub", {
        children: [new MathMLNode("mi"), parameters[0]],
      }),
      new MathMLNode("msub", {
        children: [new MathMLNode("mi", { value: "C" }), parameters[1]],
      }),
    ];
  },
} as SymbolRendererFunction<MathMLNode[]>;
