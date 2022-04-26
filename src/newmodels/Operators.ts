import Operator from "./Operator";
import HiddenTimesOperator from "./operators/HiddenTimesOperator";
import PlusOperator from "./operators/PlusOperator";

export default class Operators {
  static OPERATORS_CLASSES: {
    [name: string]: typeof Operator;
  } = {
    "+": PlusOperator,
  };

  static makeOperator(name: string): Operator {
    const cls = Operators.OPERATORS_CLASSES[name] || HiddenTimesOperator;
    return new cls();
  }
}
