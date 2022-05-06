import { DecimalPoint, Digit } from "../../math-char";
import { DecimalSymbol, IntegerSymbol } from "../../math-symbol";
import DefaultRenderer from "./DefaultRenderer";

export default class NumberRenderer extends DefaultRenderer {
  renderOperand(symbol: IntegerSymbol | DecimalSymbol): string {
    let result = symbol.integers
      .map<string>(this._renderClickableLatex)
      .join("");
    if (symbol instanceof DecimalSymbol) {
      result +=
        this._renderClickableLatex(symbol.char as DecimalPoint) +
        symbol.decimals.map<string>(this._renderClickableLatex).join("");
    }
    return result;
  }

  protected _renderClickableLatex = (char: Digit | DecimalPoint) => {
    return this._charRenderer.render(char);
  };
}
