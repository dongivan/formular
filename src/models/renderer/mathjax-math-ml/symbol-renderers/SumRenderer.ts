import { Sum } from "../../../math-char";
import { OperandSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: OperandSymbol<Sum>,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const parameters = SymbolRenderer.renderParameters(symbol);
    return [
      new MathMLNode("munderover", {
        children: [
          renderer.charRenderer.render(symbol.char),
          new MathMLNode("mrow", {
            children: [
              parameters[0],
              new MathMLNode("mo", { value: "=" }),
              parameters[1],
            ],
          }),
          parameters[2],
        ],
      }),
      parameters[3],
    ];
  },
} as SymbolRendererFunction<MathMLNode[]>;
