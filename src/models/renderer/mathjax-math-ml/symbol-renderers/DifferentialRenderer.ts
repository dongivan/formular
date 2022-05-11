import { Differential } from "../../../math-char";
import { OperandSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: OperandSymbol<Differential>,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const parameters = SymbolRenderer.renderParameters(symbol);
    return [
      renderer.charRenderer.render(symbol.char, [
        new MathMLNode("mrow", {
          children: [new MathMLNode("mi", { value: "d" }), parameters[0]],
        }),
        new MathMLNode("mrow", {
          children: [new MathMLNode("mi", { value: "d" }), parameters[1]],
        }),
      ]),
    ];
  },
} as SymbolRendererFunction<MathMLNode[]>;
