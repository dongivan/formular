import MathChar from "../math-char/MathChar";
import OperatorChar from "../math-char/OperatorChar";
import { replace } from "../utils";
import MathSymbol from "./MathSymbol";

export default class OperatorSymbol extends MathSymbol<OperatorChar> {
  get hasLeftOperand(): boolean {
    return this._char.hasLeftOperand;
  }

  get hasRightOperand(): boolean {
    return this._char.hasRightOperand;
  }

  get hasParams(): boolean {
    return !!this._char.paramsNumber;
  }

  get priority(): number {
    return this._char.priority;
  }

  get char(): OperatorChar {
    return this._char;
  }

  get chars(): MathChar[] {
    return [this._char];
  }

  renderLatex(
    renderParamsFn?: (params: MathChar[][]) => string[],
    leftLatex?: string,
    rightLatex?: string
  ): string {
    return (
      this._renderOperandLatex(this._char.leftOperandLatexTemplate, leftLatex) +
      super.renderLatex(renderParamsFn) +
      this._renderOperandLatex(this._char.rightOperandLatexTemplate, rightLatex)
    );
  }

  private _renderOperandLatex(
    template: string,
    operandLatex: string | undefined
  ) {
    return operandLatex ? replace(template, operandLatex) : "";
  }
}
