import Operand from "./Operand";
import OperandSymbol from "./OperandSymbol";
import Operators from "./Operators";

export default class Cursor {
  private _operand: Operand;
  private _pos: number;

  constructor(operand: Operand, pos = 0) {
    this._operand = operand;
    this._pos = pos;
  }

  get operand(): Operand {
    return this._operand;
  }

  get pos(): number {
    return this._pos;
  }

  moveLeft(): void {
    if (this._pos > 0) {
      this._pos -= 1;
    } else {
      const formula = this._operand.formula;
      const prevOperand = formula.findPrevOperand(this._operand);
      if (prevOperand != undefined) {
        this._operand = prevOperand;
        this._pos = prevOperand.length - 1;
      }
    }
  }

  moveRight(): void {
    if (this._pos < this._operand.length - 1) {
      this._pos += 1;
    } else {
      const formula = this._operand.formula;
      const nextOperand = formula.findNextOperand(this._operand);
      if (nextOperand != undefined) {
        this._operand = nextOperand;
        this._pos = 0;
      }
    }
  }

  insert(oper: number | string) {
    if (typeof oper == "number") {
      this._operand.insert(this._pos + 1, new OperandSymbol(oper.toString()));
      this._pos += 1;
    } else {
      const operator = Operators.makeOperator(oper);
      const operandIndex = this._operand.index;
      const formula = this._operand.formula;
      formula.insertOperator(operandIndex + 1, operator);
      const operatorIndex = formula.indexOf(operator);
      // todo
    }
  }

  toLatex(): string {
    return "{\\htmlClass{formular-cursor}{\\ \\ \\ }}";
  }
}
