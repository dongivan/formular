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
    const base = new MathMLNode("mrow");
    base.children = leftOperand || [];
    const power = renderer.renderOperand(symbol);
    power[0].children.unshift(base);
    const result: MathMLNode[] = [];
    result.push(...power);
    result.push(...(rightOperand || []));
    return result;
  },
} as SymbolRendererFunction<MathMLNode[]>;
