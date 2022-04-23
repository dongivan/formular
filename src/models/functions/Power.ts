import Formula from "../Formula";
import MathFunction from "../MathFunction";

export default class PowerFunction extends MathFunction {
  needLeft = true;

  constructor(parent: Formula) {
    super("^", parent, 1);
  }
}
