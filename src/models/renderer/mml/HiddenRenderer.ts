import { MathChar } from "../../math-char";
import { MathSymbol } from "../../math-symbol";
import MathMLNode from "../../MathMLNode";
import DefaultRenderer from "./DefaultRenderer";

export default class HiddenRenderer extends DefaultRenderer {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderOperand(symbol: MathSymbol<MathChar>): MathMLNode[] {
    return [];
  }
}
