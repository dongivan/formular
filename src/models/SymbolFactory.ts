import MathSymbol from "./MathSymbol";
import OperandSymbol from "./OperandSymbol";
import * as OperandSymbols from "./operand-symbols";
import * as OperatorSymbols from "./operator-symbols";

export default class SymbolFactory {
  private static _SYMBOL_CLASSES: {
    [key: string]: typeof MathSymbol;
  } = {
    /* operand symbols */
    number: OperandSymbols.NumberSymbol,
    hidden: OperatorSymbols.HiddenTimes,
    sqrt: OperandSymbols.SquareRoot,
    over: OperandSymbols.Over,

    /* operator symbols */
    "+": OperatorSymbols.Plus,
    "-": OperatorSymbols.Minus,
    "*": OperatorSymbols.Times,
    "/": OperatorSymbols.Divide,
    "(": OperatorSymbols.LeftParen,
    ")": OperatorSymbols.RightParen,
    "^": OperatorSymbols.Power,
  };

  private _symbols: {
    [key: number]: MathSymbol;
  } = {};
  private _cursor: OperandSymbols.Cursor;
  private _hidden: OperatorSymbols.HiddenTimes;
  private _placeholders: {
    [masterSequenceNumber: number]: {
      left: OperandSymbols.Placeholder;
      right: OperandSymbols.Placeholder;
    };
  } = {};

  constructor() {
    this._cursor = this._afterCreate(new OperandSymbols.Cursor());
    this._hidden = this._afterCreate(new OperatorSymbols.HiddenTimes());
  }

  get symbols(): {
    [key: number]: MathSymbol;
  } {
    return this._symbols;
  }

  create(name: string | number): MathSymbol[] {
    let cls;
    if (typeof name == "number") {
      cls = SymbolFactory._SYMBOL_CLASSES["number"];
    } else {
      cls = SymbolFactory._SYMBOL_CLASSES[name] || OperandSymbol;
    }
    const symbol = this._afterCreate(new cls(name)),
      symbols = [symbol];
    if (symbol.paramsNumber > 0) {
      for (let i = symbol.paramsNumber; i > 1; i--) {
        symbols.push(this._afterCreate(new OperatorSymbols.ParamSeparator()));
      }
      symbols.push(this._afterCreate(new OperatorSymbols.ParamEnd()));
    }
    return symbols;
  }

  createCursor(): OperandSymbols.Cursor {
    return this._cursor;
  }

  createPlaceholder(
    master: MathSymbol,
    leftOrRight: "left" | "right"
  ): OperandSymbols.Placeholder {
    let symbol = (this._placeholders[master.sequenceNumber] || {})[leftOrRight];
    if (!symbol) {
      symbol = this._afterCreate(
        new OperandSymbols.Placeholder(master, leftOrRight == "left" ? -1 : 1)
      );
      this._placeholders[master.sequenceNumber] = Object.assign(
        {},
        this._placeholders[master.sequenceNumber] || {},
        { [leftOrRight]: symbol }
      );
    }
    return symbol;
  }

  createHiddenTimes(): OperatorSymbols.HiddenTimes {
    return this._hidden;
  }

  private _afterCreate<T extends MathSymbol>(symbol: T): T {
    this._symbols[symbol.sequenceNumber] = symbol;
    return symbol;
  }

  findSymbolBySequenceNumber(sequenceNumber: number): MathSymbol {
    return this._symbols[sequenceNumber];
  }

  clearSymbolsAfterSequenceNumber(sequenceNumber: number): void {
    Object.keys(this._symbols).forEach((key) => {
      const sn = parseInt(key),
        symbol = this._symbols[sn];
      if (!symbol || symbol instanceof OperandSymbols.Placeholder) {
        return;
      }
      if (sn > sequenceNumber) {
        delete this._symbols[sn];
        const placeholders = this._placeholders[sn];
        if (placeholders) {
          if (placeholders.left) {
            delete this._symbols[placeholders.left.sequenceNumber];
          }
          if (placeholders.right) {
            delete this._symbols[placeholders.right.sequenceNumber];
          }
          delete this._placeholders[sn];
        }
      }
    });
  }
}
