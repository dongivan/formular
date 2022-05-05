import MathChar from "../math-char/MathChar";
import { DecimalPoint, NumberChar } from "../math-char/operand-chars";
import OperandChar from "../math-char/OperandChar";
import { replace } from "../utils";
import OperandSymbol from "./OperandSymbol";

export default class NumberSymbol<
  C extends NumberChar | DecimalPoint
> extends OperandSymbol<OperandChar> {
  constructor(char: C, params?: MathChar[][]) {
    super(char, params);
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
