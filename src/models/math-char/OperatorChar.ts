import { MathML } from "../renderer";
import MathChar from "./MathChar";

@MathML.RenderChar(({ char, params, h }) => [
  h("mo", params.length > 0 ? params.map((p) => h("mrow", p)) : char.value),
])
export default class OperatorChar extends MathChar {
  /**
   * for the reason that parentheses will render in result, the reverse polish notation should
   * have them. so "(" has a big positive priority and right and ")" has a negative one ( just
   * equals negative priority of "(" ).
   *
   * `Addition`: + -
   *
   * `Multiplication`: * /
   *
   * `Negative`: -
   *
   * `Exponentiation`: ^ !
   *
   * `Parenthese`: (
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
