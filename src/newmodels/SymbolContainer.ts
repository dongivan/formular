import MathSymbol from "./MathSymbol";
import Cursor from "./operand-symbols/Cursor";
import OperandSymbol from "./OperandSymbol";
import Operand from "./Operand";
import OperatorSymbol from "./OperatorSymbol";
import SymbolFactory from "./SymbolFactory";
import RPNList from "./RPNList";

export default class SymbolContainer {
  private _list: MathSymbol[] = [];
  private _cursor: Cursor;

  constructor() {
    // const symbol = new Placeholder();
    // this._list.push(symbol);
    this._cursor = SymbolFactory.createCursor();
    this._list.push(this._cursor);
  }

  get cursor(): Cursor {
    return this._cursor;
  }

  get length(): number {
    return this._list.length;
  }

  get(pos: number) {
    return this._list[pos];
  }

  insertAtCursor(value: number | string) {
    const cursorPos = this._list.indexOf(this._cursor);
    this._list.splice(cursorPos, 0, SymbolFactory.create(value));
  }

  moveCursorTo(pos: number) {
    if (pos < 0 || pos >= this._list.length) {
      return;
    }
    const cursorPos = this._list.indexOf(this._cursor);
    if (cursorPos == pos) {
      return;
    }
    this._list.splice(cursorPos, 1);
    this._list.splice(pos, 0, this._cursor);
  }

  moveCursor(direction: number) {
    const cursorPos = this._list.indexOf(this._cursor),
      newPos = direction + cursorPos;
    if (newPos < 0 || newPos >= this._list.length) {
      return;
    }
    this._list.splice(cursorPos, 1);
    this._list.splice(newPos, 0, this._cursor);
  }

  moveCursorLeft() {
    this.moveCursor(-1);
  }

  moveCursorRight() {
    this.moveCursor(1);
  }

  // indexOf(oper: Operand | Operator): number {
  //   return this._list.indexOf(oper);
  // }

  // findPrevOperand(operand: Operand): Operand | undefined {
  //   const pos = this._list.indexOf(operand);
  //   for (let i = pos - 1; i >= 0; i -= 1) {
  //     const prevOperand = this._list[i];
  //     if (prevOperand instanceof Operand) {
  //       return prevOperand;
  //     }
  //   }
  //   return undefined;
  // }

  // findNextOperand(operand: Operand): Operand | undefined {
  //   const pos = this._list.indexOf(operand);
  //   for (let i = pos + 1; i < this._list.length; i += 1) {
  //     const nextOperand = this._list[i];
  //     if (nextOperand instanceof Operand) {
  //       return nextOperand;
  //     }
  //   }
  //   return undefined;
  // }

  // insertOperator(pos: number, operator: Operator) {
  //   const index =
  //     pos < 0 ? 0 : pos > this._list.length ? this._list.length : pos;
  //   if (operator.hasRightOperand) {
  //     if (!(this._list[index] instanceof Operand)) {
  //       this._list.splice(index, 0, new Operand(this));
  //     }
  //   }
  //   this._list.splice(index, 0, operator);
  //   if (operator.hasLeftOperand) {
  //     if (!(this._list[index - 1] instanceof Operand)) {
  //       this._list.splice(index, 0, new Operand(this));
  //     }
  //   }
  // }

  // toRPNList(): (Operand | Operator)[] {
  //   const RPNList: (Operand | Operator)[] = [],
  //     stack: Operator[] = [];
  //   let pos = 0;
  //   while (pos < this._list.length) {
  //     const oper = this._list[pos];
  //     if (oper instanceof Operand) {
  //       RPNList.push(oper);
  //     } else if (oper instanceof Operator) {
  //       while (stack.length > 0 && stack[0].priority >= oper.priority) {
  //         RPNList.push(stack[0]);
  //         stack.shift();
  //       }
  //       stack.unshift(oper);
  //     }
  //     pos += 1;
  //   }
  //   while (stack.length > 0) {
  //     RPNList.push(stack[0]);
  //     stack.shift();
  //   }

  //   return RPNList;
  // }

  toRPNList(): readonly (Operand | OperatorSymbol)[] {
    const rpnList = new RPNList(this);
    return rpnList.output;
    /* base on shunting yard algorithm */
    // const rpnList: (Operand | OperatorSymbol)[] = [],
    //   operatorStack: OperatorSymbol[] = [];
    // let pos = 0,
    //   operand: Operand = new Operand();
    // while (pos < this._list.length) {
    //   const symbol = this._list[pos];
    //   if (symbol instanceof OperandSymbol) {
    //     if (!operand.push(symbol)) {
    //       rpnList.push(operand);
    //       operand = new Operand();
    //       this._pushOperatorIntoStack(
    //         SymbolFactory.create("hidden") as OperatorSymbol,
    //         operatorStack,
    //         rpnList
    //       );
    //       operand.push(symbol);
    //     }
    //   } else if (symbol instanceof OperatorSymbol) {
    //     if (operand.length > 0) {
    //       rpnList.push(operand);
    //       operand = new Operand();
    //     }
    //     this._pushOperatorIntoStack(symbol, operatorStack, rpnList);
    //   }

    //   pos += 1;
    // }

    // if (operand.length > 0) {
    //   rpnList.push(operand);
    // }

    // while (operatorStack.length > 0) {
    //   rpnList.push(operatorStack[0]);
    //   operatorStack.shift();
    // }
    // return rpnList;
  }

  // private _pushOperatorIntoStack(
  //   operator: OperatorSymbol,
  //   operatorStack: OperatorSymbol[],
  //   rpnList: (Operand | OperandSymbol)[]
  // ) {
  //   while (
  //     operatorStack.length > 0 &&
  //     operatorStack[0].priority >= operator.priority
  //   ) {
  //     rpnList.push(operatorStack[0]);
  //     operatorStack.shift();
  //   }
  //   operatorStack.unshift(operator);
  // }

  toLatex(): string {
    //   const RPNList = this.toRPNList(),
    const rpnList = this.toRPNList(),
      stack: string[] = [];
    // let latexText = "";
    // latexText = this._list.map<string>((symbol) => symbol.toLatex()).join("");
    let pos = 0;
    while (pos < rpnList.length) {
      const oper = rpnList[pos];
      if (oper instanceof Operand) {
        stack.push(oper.toLatex());
      } else if (oper instanceof OperatorSymbol) {
        let latex = oper.toLatex();
        if (oper.hasRightOperand) {
          const rightOperand = stack.pop();
          if (rightOperand) {
            latex += rightOperand;
          }
        }
        if (oper.hasLeftOperand) {
          const leftOperand = stack.pop();
          if (leftOperand) {
            latex = leftOperand + latex;
          }
        }
        stack.push(latex);
      }

      pos += 1;
    }
    // return latexText;
    return stack.join("");
  }

  toJSON(): string {
    return "[" + this._list.toString() + "]";
  }
}
