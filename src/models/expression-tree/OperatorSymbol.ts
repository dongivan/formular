import MathChar from "../MathChar";
import OperatorChar from "../OperatorChar";
import MathSymbol from "./MathSymbol";

export default class OperatorSymbol extends MathSymbol {
  private _operator: OperatorChar;

  constructor(operator: OperatorChar, params?: MathChar[][]) {
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

  get char(): OperatorChar {
    return this._operator;
  }

  get chars(): MathChar[] {
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
