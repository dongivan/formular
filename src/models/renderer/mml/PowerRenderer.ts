import { OperatorSymbol } from "../../math-symbol";
import MathMLNode from "../../MathMLNode";
import DefaultRenderer from "./DefaultRenderer";

export default class PowerRenderer extends DefaultRenderer {
  renderOperator(
    symbol: OperatorSymbol,
    leftOperand: MathMLNode[] | undefined,
    rightOperand: MathMLNode[] | undefined
  ): MathMLNode[] {
    const base = new MathMLNode("mrow");
    base.children = leftOperand || [];
    const power = this.renderOperand(symbol);
    power[0].children.unshift(base);
    const result: MathMLNode[] = [];
    result.push(...power);
    result.push(...(rightOperand || []));
    return result;
  }
}
