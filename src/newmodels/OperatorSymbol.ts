import MathSymbol from "./MathSymbol";

export default abstract class OperatorSymbol extends MathSymbol {
  /* 
    for the reason that parentheses will render in result, the reverse polish notation should
    have them. so "(" has a big positive priority and right and ")" has a negative one ( just
    equals negative priority of "(" ), and the priority of other operators MUST NOT BE ZERO!!!
  */
  protected _priority = 1;
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
