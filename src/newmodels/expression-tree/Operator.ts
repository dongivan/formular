import MathSymbol from "../MathSymbol";
import OperatorSymbol from "../OperatorSymbol";
import SymbolGroup from "./SymbolGroup";

export default class Operator extends SymbolGroup {
  private _operator: OperatorSymbol;

  constructor(operator: OperatorSymbol, params?: MathSymbol[][]) {
    super(params);
    this._operator = operator;
  }

  get hasLeftOperand(): boolean {
    return this._operator.hasLeftOperand;
  }

  get hasRightOperand(): boolean {
    return this._operator.hasRightOperand;
  }

  get hasParams(): boolean {
    return !!this._operator.paramsNumber;
  }

  get priority(): number {
    return this._operator.priority;
  }

  get symbol(): OperatorSymbol {
    return this._operator;
  }

  get symbols(): MathSymbol[] {
    return [this._operator];
  }

  toString(): string {
    return (
      this._operator.toString() +
      (this._params.length > 0
        ? "(" +
          this.params.map<string>((param) =>
            param.map<string>((group) => group.toString()).join(", ")
          ) +
          ")"
        : "")
    );
  }
}
