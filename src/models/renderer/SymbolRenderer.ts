import Formula from "../Formula";
import { MathChar } from "../math-char";
import { MathSymbol, OperandSymbol, OperatorSymbol } from "../math-symbol";

export default abstract class SymbolRenderer<R> {
  protected _formula: Formula;

  constructor(formula: Formula) {
    this._formula = formula;
  }

  render(symbol: MathSymbol<MathChar>, leftOperand?: R, rightOperand?: R): R {
    if (symbol instanceof OperatorSymbol) {
      return this.renderOperator(symbol, leftOperand, rightOperand);
    } else {
      return this.renderOperand(symbol);
    }
  }

  abstract renderOperand(symbol: OperandSymbol<MathChar>): R;

  abstract renderOperator(
    symbol: OperatorSymbol,
    leftOperand: R | undefined,
    rightOperand: R | undefined
  ): R;
}
