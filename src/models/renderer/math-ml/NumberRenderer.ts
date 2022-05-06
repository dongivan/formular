import { DecimalPoint, Digit } from "../../math-char";
import { DecimalSymbol, IntegerSymbol } from "../../math-symbol";
import MathMLNode from "../../MathMLNode";
import DefaultRenderer from "./DefaultRenderer";

export default class NumberRenderer extends DefaultRenderer {
  renderOperand(symbol: IntegerSymbol | DecimalSymbol): MathMLNode[] {
    const result = symbol.integers.map<MathMLNode>((char) =>
      this._renderChar(char)
    );
    if (symbol instanceof DecimalSymbol) {
      result.push(this._renderChar(symbol.char as DecimalPoint));
      result.push(
        ...symbol.decimals.map<MathMLNode>((char) => this._renderChar(char))
      );
    }
    return result;
  }

  protected _renderChar = (char: Digit | DecimalPoint) => {
    return this._charRenderer.render(char);
  };
}
