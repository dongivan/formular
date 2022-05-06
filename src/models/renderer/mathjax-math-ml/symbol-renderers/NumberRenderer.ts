import { DecimalPoint } from "../../../math-char";
import { DecimalSymbol, IntegerSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: IntegerSymbol | DecimalSymbol,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const result = symbol.integers.map<MathMLNode>((char) =>
      renderer.charRenderer.render(char)
    );
    if (symbol instanceof DecimalSymbol) {
      result.push(renderer.charRenderer.render(symbol.char as DecimalPoint));
      result.push(
        ...symbol.decimals.map<MathMLNode>((char) =>
          renderer.charRenderer.render(char)
        )
      );
    }
    return result;
  },
} as SymbolRendererFunction<MathMLNode[]>;
