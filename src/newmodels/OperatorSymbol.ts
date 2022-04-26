import MathSymbol from "./MathSymbol";

export default abstract class OperatorSymbol extends MathSymbol {
  protected _priority = 0;
  protected _hasLeftOperand = true;
  protected _hasRightOperand = true;

  constructor(value: string) {
    super(value);
  }

  get priority(): number {
    return this._priority;
  }

  get hasLeftOperand(): boolean {
    return this._hasLeftOperand;
  }

  get hasRightOperand(): boolean {
    return this._hasRightOperand;
  }
}
