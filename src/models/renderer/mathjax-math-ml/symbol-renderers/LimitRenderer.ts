import { Limit } from "../../../math-char";
import { OperandSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: OperandSymbol<Limit>,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const parameters = SymbolRenderer.renderParameters(symbol);
    return [
      new MathMLNode("munder", {
        children: [
          renderer.charRenderer.render(symbol.char),
          new MathMLNode("mrow", {
            children: [
              parameters[0],
              new MathMLNode("mo", {
                value: "&#x2192;",
                attrs: { stretchy: "false" },
              }),
              parameters[1],
            ],
          }),
        ],
      }),
      parameters[2],
    ];
  },
} as SymbolRendererFunction<MathMLNode[]>;
