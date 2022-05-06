import { DecimalPoint, Digit } from "../../math-char";
import { DecimalSymbol, IntegerSymbol } from "../../math-symbol";
import MMLElement from "../../MMLElement";
import DefaultRenderer from "./DefaultRenderer";

export default class NumberRenderer extends DefaultRenderer {
  renderOperand(symbol: IntegerSymbol | DecimalSymbol): MMLElement[] {
    const result = symbol.integers.map<MMLElement>((char) =>
      this._renderChar(char)
    );
    if (symbol instanceof DecimalSymbol) {
      result.push(this._renderChar(symbol.char as DecimalPoint));
      result.push(
        ...symbol.decimals.map<MMLElement>((char) => this._renderChar(char))
      );
    }
    return result;
  }

  protected _renderChar = (char: Digit | DecimalPoint) => {
    const ele = new MMLElement(char.mmlTag, char.mmlAttrs);
    if (char.clickable) {
      ele.setAttr({ [char.clickableDataKey]: char.sequenceNumber.toString() });
    }
    ele.value = char.value;
    return ele;
  };
}
