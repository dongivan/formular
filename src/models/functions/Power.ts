import Placeholder from "../controls/Placeholder";
import Formula from "../Formula";
import GenericSymbol from "../GenericSymbol";
import MathFunction from "../MathFunction";

export default class PowerFunction extends MathFunction {
  needLeft = false;

  constructor(formula: Formula) {
    super(formula, "^", 2);
  }

  afterInsert(leftSymbol: GenericSymbol): GenericSymbol {
    if (leftSymbol.position == 0) {
      leftSymbol.formula?.insertPlaceholder(0);
    }
    leftSymbol.delete();
    if (leftSymbol instanceof Placeholder) {
      return this.params[0][0];
    } else {
      this.params[0].push(leftSymbol);
      return this.params[1][0];
    }
  }

  toLatex(): string {
    const base = "{" + this.params[0].renderLatex(true) + "}",
      power = "{" + this.params[1].renderLatex() + "}";
    return base + this.value + power;
  }
}
