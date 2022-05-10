import { OperatorSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operatorRenderer: (
    symbol: OperatorSymbol,
    leftOperand: MathMLNode[] | undefined,
    rightOperand: MathMLNode[] | undefined,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const power = renderer.renderOperand(symbol);
    power[0].children.unshift(
      new MathMLNode("mrow", { children: leftOperand || [] })
    );
    return [...power, ...(rightOperand || [])];
  },
} as SymbolRendererFunction<MathMLNode[]>;
