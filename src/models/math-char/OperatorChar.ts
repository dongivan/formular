import MathChar from "./MathChar";

export default abstract class OperatorChar extends MathChar {
  /* 
    for the reason that parentheses will render in result, the reverse polish notation should
    have them. so "(" has a big positive priority and right and ")" has a negative one ( just
    equals negative priority of "(" ).
  */
  static readonly Priorities = {
    Addition: 1,
    Multiplication: 2,
    Negative: 4,
    Exponentiation: 8,
    Parenthese: 16,
  };

  protected _priority = OperatorChar.Priorities.Addition;
  protected _hasLeftOperand = true;
  protected _hasRightOperand = true;
  protected _leftOperandLatexTemplate = "<0>";
  protected _rightOperandLatexTemplate = "<0>";
  readonly mmlTag: string = "mo";

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

  get leftOperandLatexTemplate(): string {
    return this._leftOperandLatexTemplate;
  }

  get rightOperandLatexTemplate(): string {
    return this._rightOperandLatexTemplate;
  }
}
