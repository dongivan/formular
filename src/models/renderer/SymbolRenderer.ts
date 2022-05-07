import Formula from "../Formula";
import { MathChar, OperandChar } from "../math-char";
import { MathSymbol, OperandSymbol, OperatorSymbol } from "../math-symbol";

export default abstract class BaseSymbolRenderer<R> {
  protected _formula: Formula;

  constructor(formula: Formula) {
    this._formula = formula;
  }

  get formula(): Formula {
    return this._formula;
  }

  render(symbol: MathSymbol<MathChar>, leftOperand?: R, rightOperand?: R): R {
    if (symbol instanceof OperatorSymbol) {
      return this.renderOperator(symbol, leftOperand, rightOperand);
    } else {
      return this.renderOperand(symbol as OperandSymbol<OperandChar>);
    }
  }

  abstract renderOperand(symbol: OperandSymbol<OperandChar>): R;

  abstract renderOperator(
    symbol: OperatorSymbol,
    leftOperand: R | undefined,
    rightOperand: R | undefined
  ): R;
}
