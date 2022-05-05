import { MathChar } from "../../math-char";
import { MathSymbol, OperatorSymbol } from "../../math-symbol";
import Renderer from "../Renderer";
import MMLElement from "../../MMLElement";
import { replace } from "@/models/utils";

export default class DefaultRenderer extends Renderer<MMLElement[]> {
  renderOperand(symbol: MathSymbol<MathChar>): MMLElement[] {
    const ele = new MMLElement(symbol.char.mmlTag, symbol.char.mmlAttrs),
      result: MMLElement[] = [ele];
    if (symbol.char.clickable) {
      ele.setAttr({
        [symbol.char.clickableDataKey]: symbol.char.sequenceNumber.toString(),
      });
    }
    ele.value = replace(symbol.char.mmlValueTemplate, symbol.char.value);
    if (symbol.hasParams) {
      const children = symbol.params.map<MMLElement>((param) => {
        const row = new MMLElement("mrow");
        const infix = this._formula.infixMaker.make(param);
        const postfix = this._formula.postfixMaker.make(infix);
        const tree = this._formula.binaryTreeMaker.make(postfix);
        row.children = tree.renderMML().children;
        return row;
      });
      ele.children = children;
    }
    return result;
  }

  renderOperator(
    symbol: OperatorSymbol,
    leftOperand: MMLElement[] | undefined,
    rightOperand: MMLElement[] | undefined
  ): MMLElement[] {
    const result: MMLElement[] = [];
    result.push(...(leftOperand || []));
    result.push(...this.renderOperand(symbol));
    result.push(...(rightOperand || []));
    return result;
  }
}
