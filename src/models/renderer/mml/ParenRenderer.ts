import { MathChar, AbstractParen } from "../../math-char";
import { MathSymbol } from "../../math-symbol";
import MMLElement from "../../MMLElement";
import DefaultRenderer from "./DefaultRenderer";

export default class ParenRenderer extends DefaultRenderer {
  protected static readonly PAREN_ATTRS = [
    { stretchy: "false" },
    { stretchy: "true", minsize: "1.2em", maxsize: "1.2em" },
    { stretchy: "true", minsize: "1.623em", maxsize: "1.623em" },
    { stretchy: "true", minsize: "2.047em", maxsize: "2.047em" },
    { stretchy: "true", minsize: "2.470em", maxsize: "2.470em" },
  ];

  renderOperand(symbol: MathSymbol<MathChar>): MMLElement[] {
    const result = super.renderOperand(symbol);
    const char = symbol.char;
    if (char instanceof AbstractParen) {
      const el = result[0];
      const attrs =
        ParenRenderer.PAREN_ATTRS[Math.min(Math.max(char.level, 0), 4)];
      el.setAttr(attrs);
    }

    return result;
  }
}
