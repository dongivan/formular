import MathSymbol from "./MathSymbol";
import Cursor from "./operand-symbols/Cursor";
import SymbolFactory from "./SymbolFactory";
import { ParamEnd, ParamSeparator } from "./operator-symbols";
import ExpressionBinaryTree from "./rpn/ExpressionBinaryTree";
import InfixExpression from "./rpn/InfixExpression";
import PostfixExpression from "./rpn/PostfixExpression";

export default class SymbolContainer {
  private _list: MathSymbol[] = [];
  private _cursor: Cursor;

  constructor() {
    this._cursor = SymbolFactory.createCursor();
    this._list.push(this._cursor);
  }

  get cursor(): Cursor {
    return this._cursor;
  }

  get length(): number {
    return this._list.length;
  }

  get symbols(): MathSymbol[] {
    return this._list;
  }

  get(pos: number): MathSymbol | undefined {
    return this._list[pos];
  }

  insertAtCursor(value: number | string) {
    const cursorPos = this._list.indexOf(this._cursor),
      symbols = SymbolFactory.create(value);
    this._list.splice(cursorPos, 0, ...symbols);
    if (symbols.length > 1) {
      this.moveCursorTo(cursorPos + symbols.length - 1);
    }
  }

  deleteSymbolBeforeCursor() {
    const cursorPos = this._list.indexOf(this._cursor);
    if (cursorPos > 0) {
      const symbol = this._list[cursorPos - 1];
      if (symbol instanceof ParamSeparator || symbol instanceof ParamEnd) {
        /* previous symbol is a param separator or a param end, just move left. */
        this.moveCursorLeft();
        return;
      }
      if (symbol.paramsNumber > 0) {
        /* previous symbol has params */
        let nextPos = cursorPos + 1,
          paramsEmpty = true;
        while (nextPos < this._list.length) {
          const nextSymbol = this._list[nextPos];
          if (nextSymbol instanceof ParamSeparator) {
            /* next symbol is a param separator, go next pos */
            nextPos += 1;
          } else if (nextSymbol instanceof ParamEnd) {
            /* next symbol is a param end, AND symbols between `symbol` and `nextSymbol` ARE
              ALL ParamSeparator objects.*/
            break;
          } else {
            /* next symbol IS NOT ParamSeparator OR ParamEnd, which means params are not empty. */
            paramsEmpty = false;
            break;
          }
        }
        if (paramsEmpty) {
          /* params ARE empty, remove all symbols from `cursorPos + 1` to `nextPos` */
          this._list.splice(cursorPos + 1, nextPos - cursorPos);
        } else {
          /* params ARE NOT empty, just move left. */
          this.moveCursorLeft();
          return;
        }
      }
      this._list.splice(cursorPos - 1, 1);
    }
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

  toLatex(): string {
    const infix = new InfixExpression(this._list);
    const postfix = new PostfixExpression(infix);
    console.log(postfix.toString());
    const tree = new ExpressionBinaryTree(postfix);
    return tree.renderLatex();
  }

  toString(): string {
    return "[" + this._list.toString() + "]";
  }
}
