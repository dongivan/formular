import Formula from "./Formula";
import GenericSymbol from "./GenericSymbol";

export default abstract class Operator extends GenericSymbol {
  needLeft = true;
  needRight = true;

  constructor(formula: Formula, value: string) {
    super(formula, value);
  }
}
