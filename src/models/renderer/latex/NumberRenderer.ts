/* eslint-disable @typescript-eslint/no-unused-vars */
import { DecimalPoint, NumberChar } from "../../math-char";
import {
  DecimalSymbol,
  IntegerSymbol,
  OperatorSymbol,
} from "../../math-symbol";
import { replace } from "../../utils";
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

  renderOperator(
    symbol: OperatorSymbol,
    leftOperand: string | undefined,
    rightOperand: string | undefined
  ): string {
    return "";
  }

  protected _renderClickableLatex = (char: NumberChar | DecimalPoint) => {
    const val = char.value;
    return char.clickable
      ? replace(char.clickableLatexTemplate, {
          SN: char.sequenceNumber.toString(),
          LATEX: val,
        })
      : val;
  };
}
