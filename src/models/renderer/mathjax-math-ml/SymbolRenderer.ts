import { MathChar } from "../../math-char";
import { MathSymbol, OperatorSymbol } from "../../math-symbol";
import BaseSymbolRenderer from "../SymbolRenderer";
import MathMLNode from "../../MathMLNode";
import CharRenderer from "./CharRenderer";
import { findByClass } from "../../utils";
import MathCharRenderer from "./symbol-renderers/MathCharRenderer";
import NumberRenderer from "./symbol-renderers/NumberRenderer";
import PowerRenderer from "./symbol-renderers/PowerRenderer";
import {
  OperandRendererFunction,
  OperatorRendererFunction,
} from "../SymbolRendererTypes";
import FlatRenderer from "./symbol-renderers/FlatRenderer";
import SumRenderer from "./symbol-renderers/SumRenderer";
import IIntegralRenderer from "./symbol-renderers/IIntegralRenderer";
import DifferentialRenderer from "./symbol-renderers/DifferentialRenderer";
import CombinationRenderer from "./symbol-renderers/CombinationRenderer";

const operandRendererFunctions: Record<
  string,
  OperandRendererFunction<MathMLNode[]> | undefined
> = {
  MathChar: MathCharRenderer.operandRenderer,
  Digit: NumberRenderer.operandRenderer,
  DecimalPoint: NumberRenderer.operandRenderer,
  Ln: FlatRenderer.operandRenderer,
  Sum: SumRenderer.operandRenderer,
  IIntegral: IIntegralRenderer.operandRenderer,
  Differential: DifferentialRenderer.operandRenderer,
  Combination: CombinationRenderer.operandRenderer,
  HiddenTimes: () => {
    return [];
  },
};

const operatorRendererFunctions: Record<
  string,
  OperatorRendererFunction<MathMLNode[]> | undefined
> = {
  MathChar: MathCharRenderer.operatorRenderer,
  Power: PowerRenderer.operatorRenderer,
};

export default class SymbolRenderer extends BaseSymbolRenderer<MathMLNode[]> {
  protected _charRenderer = new CharRenderer();

  get charRenderer(): CharRenderer {
    return this._charRenderer;
  }

  renderOperand(symbol: MathSymbol<MathChar>): MathMLNode[] {
    const renderer = findByClass<
      MathChar,
      OperandRendererFunction<MathMLNode[]>
    >(symbol.char, operandRendererFunctions);
    return renderer ? renderer(symbol, this) : [];
  }

  renderOperator(
    symbol: OperatorSymbol,
    leftOperand: MathMLNode[] | undefined,
    rightOperand: MathMLNode[] | undefined
  ): MathMLNode[] {
    const renderer = findByClass<
      MathChar,
      OperatorRendererFunction<MathMLNode[]>
    >(symbol.char, operatorRendererFunctions);
    return renderer ? renderer(symbol, leftOperand, rightOperand, this) : [];
  }

  static renderParameters(
    symbol: MathSymbol<MathChar>,
    renderer: SymbolRenderer
  ) {
    return symbol.params.map<MathMLNode>((param, i) => {
      const infix = renderer.formula.infixMaker.make(param);
      const postfix = renderer.formula.postfixMaker.make(infix);
      const tree = renderer.formula.binaryTreeMaker.make(
        postfix,
        symbol.char.hasParamParen(i)
      );
      return new MathMLNode("mrow", { children: tree.renderMathML().children });
    });
  }
}
