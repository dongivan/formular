import MathSymbol from "./MathSymbol";
import Cursor from "./operand-symbols/Cursor";
import SymbolFactory from "./SymbolFactory";
import { ParamEnd, ParamSeparator } from "./operator-symbols";
import ExpressionBinaryTree from "./expression-tree/ExpressionBinaryTree";
import InfixExpression from "./expression-tree/InfixExpression";
import PostfixExpression from "./expression-tree/PostfixExpression";
import Config from "./Config";

export default class SymbolContainer {
  private _list: MathSymbol[] = [];
  private _steps: string[] = [];
  private _currentStep = -1;
  private _cursor: Cursor;

  constructor() {
    Config.init();
    this._cursor = SymbolFactory.createCursor();
    this._list.push(this._cursor);
    this._pushStep();
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
      this.moveCursorTo(cursorPos + 1);
    }

    this._pushStep();
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
    this._pushStep();
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

  private _pushStep(): void {
    this._steps.splice(this._currentStep + 1);
    this._steps.push(JSON.stringify(this._list));
    this._currentStep = this._steps.length - 1;
  }

  undo(): void {
    if (!this.couldUndo) {
      return;
    }
    this._currentStep -= 1;
    const step = this._steps[this._currentStep];
    if (!step) {
      return;
    }
    this._list = this._rebuildStep(step);
  }

  redo(): void {
    if (!this.couldRedo) {
      return;
    }
    this._currentStep += 1;
    const step = this._steps[this._currentStep];
    if (!step) {
      return;
    }
    this._list = this._rebuildStep(step);
  }

  private _rebuildStep(step: string): MathSymbol[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list: MathSymbol[] = JSON.parse(step, (k: string, v: any) => {
      if (/[0-9]+/.test(k)) {
        const { type, value }: { type: string; value: string } = v;
        if (type == Cursor.name) {
          return this._cursor;
        } else {
          return SymbolFactory.createSymbol(type, value);
        }
      } else {
        return v;
      }
    });
    return list;
  }

  get couldRedo(): boolean {
    return this._currentStep < this._steps.length - 1;
  }

  get couldUndo(): boolean {
    return this._currentStep > 0;
  }

  toLatex(): string {
    const infix = new InfixExpression(this._list);
    const postfix = new PostfixExpression(infix);
    const tree = new ExpressionBinaryTree(postfix);
    return tree.renderLatex();
  }

  toString(): string {
    return "[" + this._list.toString() + "]";
  }
}
