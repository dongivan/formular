import MathSymbol from "./MathSymbol";
import Cursor from "./operand-symbols/Cursor";
import SymbolFactory from "./SymbolFactory";
import { ParamEnd, ParamSeparator } from "./operator-symbols";
import BinaryTreeMaker from "./expression-tree/BinaryTreeMaker";
import PostfixListMaker from "./expression-tree/PostfixListMaker";
import Config from "./Config";
import InfixListMaker from "./expression-tree/InfixListMaker";

export default class Formula {
  private _list: MathSymbol[] = [];
  // private _steps: string[] = [];
  private _steps: number[][] = [];
  private _currentStep = -1;
  private _cursor: Cursor;

  private _symbolFactory: SymbolFactory;
  private _infixMaker: InfixListMaker;
  private _postfixMaker: PostfixListMaker;
  private _binaryTreeMaker: BinaryTreeMaker;

  constructor() {
    Config.init();

    this._symbolFactory = new SymbolFactory();
    this._infixMaker = new InfixListMaker(this);
    this._postfixMaker = new PostfixListMaker(this);
    this._binaryTreeMaker = new BinaryTreeMaker(this);

    this._cursor = this._symbolFactory.createCursor();
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

  get symbolFactory(): SymbolFactory {
    return this._symbolFactory;
  }

  get infixMaker(): InfixListMaker {
    return this._infixMaker;
  }

  get postfixMaker(): PostfixListMaker {
    return this._postfixMaker;
  }

  get binaryTreeMaker(): BinaryTreeMaker {
    return this._binaryTreeMaker;
  }

  get(pos: number): MathSymbol | undefined {
    return this._list[pos];
  }

  insertAtCursor(value: number | string) {
    if (this._currentStep < this._steps.length - 1) {
      this._symbolFactory.clearSymbolsAfterSequenceNumber(
        Math.max(...this._steps[this._currentStep])
      );
    }

    const cursorPos = this._list.indexOf(this._cursor),
      symbols = this._symbolFactory.create(value);
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
    this._steps.push(this._list.map<number>((symbol) => symbol.sequenceNumber));
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

  private _rebuildStep(step: number[]): MathSymbol[] {
    const list: MathSymbol[] = step.map<MathSymbol>((sn) =>
      this._symbolFactory.findSymbolBySequenceNumber(sn)
    );
    return list;
  }

  get couldRedo(): boolean {
    return this._currentStep < this._steps.length - 1;
  }

  get couldUndo(): boolean {
    return this._currentStep > 0;
  }

  toLatex(): string {
    const infix = this._infixMaker.make(this._list);
    const postfix = this._postfixMaker.make(infix);
    const tree = this._binaryTreeMaker.make(postfix);
    const latex = tree.renderLatex();
    return latex;
  }

  toString(): string {
    return "[" + this._list.toString() + "]";
  }
}
