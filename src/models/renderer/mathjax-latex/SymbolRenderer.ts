import { MathChar } from "../../math-char";
import { MathSymbol, OperatorSymbol } from "../../math-symbol";
import { findByClass, replace } from "../../utils";
import BaseSymbolRenderer from "../SymbolRenderer";
import {
  OperandRendererFunction,
  OperatorRendererFunction,
} from "../SymbolRendererTypes";
import CharRenderer from "./CharRenderer";
import MathCharRenderer from "./symbol-renderers/MathCharRenderer";
import NumberRenderer from "./symbol-renderers/NumberRenderer";

const operandRendererFunctions: Record<
  string,
  OperandRendererFunction<string> | undefined
> = {
  MathChar: MathCharRenderer.operandRenderer,
  Digit: NumberRenderer.operandRenderer,
  DecimalPoint: NumberRenderer.operandRenderer,
  HiddenTimes: () => {
    return "";
  },
};

const operatorRendererFunctions: Record<
  string,
  OperatorRendererFunction<string> | undefined
> = {
  MathChar: MathCharRenderer.operatorRenderer,
};

export default class SymbolRenderer extends BaseSymbolRenderer<string> {
  protected _charRenderer = new CharRenderer();

  get charRenderer(): CharRenderer {
    return this._charRenderer;
  }

  renderOperand(symbol: MathSymbol<MathChar>): string {
    const renderer = findByClass<MathChar, OperandRendererFunction<string>>(
      symbol.char,
      operandRendererFunctions
    );
    return renderer ? renderer(symbol, this) : "";
  }

  renderOperator(
    symbol: OperatorSymbol,
    leftOperand: string | undefined,
    rightOperand: string | undefined
  ): string {
    const renderer = findByClass<MathChar, OperatorRendererFunction<string>>(
      symbol.char,
      operatorRendererFunctions
    );
    return renderer ? renderer(symbol, leftOperand, rightOperand, this) : "";
  }

  private _renderOperandLatex(
    template: string,
    operandLatex: string | undefined
  ) {
    return operandLatex ? replace(template, operandLatex) : "";
  }
}
