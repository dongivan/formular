import { DecimalPoint } from "../../../math-char";
import { DecimalSymbol, IntegerSymbol } from "../../../math-symbol";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: IntegerSymbol | DecimalSymbol,
    renderer: SymbolRenderer
  ): string => {
    let result = symbol.integers
      .map<string>((char) => renderer.charRenderer.render(char))
      .join("");
    if (symbol instanceof DecimalSymbol) {
      result +=
        renderer.charRenderer.render(symbol.char as DecimalPoint) +
        symbol.decimals
          .map<string>((char) => renderer.charRenderer.render(char))
          .join("");
    }
    return result;
  },
} as SymbolRendererFunction<string>;
