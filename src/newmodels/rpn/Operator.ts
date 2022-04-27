import OperatorSymbol from "../OperatorSymbol";
import Operand from "./Operand";

export default class Operator {
  private _operator: OperatorSymbol;
  private _params: (Operand | Operator)[][] = [];

  constructor(operator: OperatorSymbol) {
    this._operator = operator;
  }

  set params(val: (Operand | Operator)[][]) {
    this._params = val;
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

  toLatex(): string {
    return (
      this._operator.toLatex() +
      this._params
        .map<string>(
          (param) =>
            "{" + param.map<string>((item) => item.toLatex()).join("") + "}"
        )
        .join("")
    );
  }

  toJSON(): string {
    return (
      this._operator.toLatex() +
      this._params
        .map<string>(
          (param) =>
            "{" + param.map<string>((item) => item.toJSON()).join("") + "}"
        )
        .join("")
    );
  }
}
