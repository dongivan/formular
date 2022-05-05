import { OperatorSymbol } from "../../math-symbol";
import MMLElement from "../../MMLElement";
import DefaultRenderer from "./DefaultRenderer";

export default class PowerRenderer extends DefaultRenderer {
  renderOperator(
    symbol: OperatorSymbol,
    leftOperand: MMLElement[] | undefined,
    rightOperand: MMLElement[] | undefined
  ): MMLElement[] {
    const base = new MMLElement("mrow");
    base.children = leftOperand || [];
    const power = this.renderOperand(symbol);
    power[0].children.unshift(base);
    const result: MMLElement[] = [];
    result.push(...power);
    result.push(...(rightOperand || []));
    return result;
  }
}
