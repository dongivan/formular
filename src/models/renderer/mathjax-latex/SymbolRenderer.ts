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

type OperandLatexTemplate = {
  left: string;
  right: string;
};

const operandLatexTemplates: Record<string, OperandLatexTemplate> = {
  OperatorChar: {
    left: "<0>",
    right: "<0>",
  },
  Power: {
    left: "{<0>}",
    right: "<0>",
  },
};

function renderOperandLatex(
  template: string,
  operandLatex: string | undefined
) {
  return operandLatex ? replace(template, operandLatex) : "";
}

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
    const template = findByClass<MathChar, OperandLatexTemplate>(
      symbol.char,
      operandLatexTemplates
    );
    return renderer
      ? renderer(
          symbol,
          renderOperandLatex(template?.left || "<0>", leftOperand),
          renderOperandLatex(template?.right || "<0>", rightOperand),
          this
        )
      : "";
  }
}
