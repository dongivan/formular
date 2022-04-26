import Cursor from "./Cursor";
import Operand from "./Operand";
import Operator from "./Operator";

export default class Formula {
  private _list: (Operand | Operator)[] = [];
  private _cursor: Cursor;

  constructor() {
    const operand = new Operand(this);
    this._list.push(operand);
    this._cursor = new Cursor(operand, 0);
  }

  get cursor(): Cursor {
    return this._cursor;
  }

  indexOf(oper: Operand | Operator): number {
    return this._list.indexOf(oper);
  }

  findPrevOperand(operand: Operand): Operand | undefined {
    const pos = this._list.indexOf(operand);
    for (let i = pos - 1; i >= 0; i -= 1) {
      const prevOperand = this._list[i];
      if (prevOperand instanceof Operand) {
        return prevOperand;
      }
    }
    return undefined;
  }

  findNextOperand(operand: Operand): Operand | undefined {
    const pos = this._list.indexOf(operand);
    for (let i = pos + 1; i < this._list.length; i += 1) {
      const nextOperand = this._list[i];
      if (nextOperand instanceof Operand) {
        return nextOperand;
      }
    }
    return undefined;
  }

  insertOperator(pos: number, operator: Operator) {
    const index =
      pos < 0 ? 0 : pos > this._list.length ? this._list.length : pos;
    if (operator.hasRightOperand) {
      if (!(this._list[index] instanceof Operand)) {
        this._list.splice(index, 0, new Operand(this));
      }
    }
    this._list.splice(index, 0, operator);
    if (operator.hasLeftOperand) {
      if (!(this._list[index - 1] instanceof Operand)) {
        this._list.splice(index, 0, new Operand(this));
      }
    }
  }

  toRPNList(): (Operand | Operator)[] {
    const RPNList: (Operand | Operator)[] = [],
      stack: Operator[] = [];
    let pos = 0;
    while (pos < this._list.length) {
      const oper = this._list[pos];
      if (oper instanceof Operand) {
        RPNList.push(oper);
      } else if (oper instanceof Operator) {
        while (stack.length > 0 && stack[0].priority >= oper.priority) {
          RPNList.push(stack[0]);
          stack.shift();
        }
        stack.unshift(oper);
      }
      pos += 1;
    }
    while (stack.length > 0) {
      RPNList.push(stack[0]);
      stack.shift();
    }

    return RPNList;
  }

  toLatex(): string {
    const RPNList = this.toRPNList(),
      stack: Operand[] = [];
    let latex = "";
    while (RPNList.length > 0) {
      const oper = RPNList[0];
      RPNList.shift();
      if (oper instanceof Operand) {
        stack.push(oper);
      } else if (oper instanceof Operator) {
        const rightOperand = stack.pop();
        if (!rightOperand) {
          continue;
        }
        const leftOperand = stack.pop();
        if (!leftOperand) {
          continue;
        }
        latex +=
          leftOperand.toLatex() + oper.toLatex() + rightOperand.toLatex();
      }
    }
    return latex;
  }
}
