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

  static create(name: string | number): MathSymbol[] {
    let cls;
    if (typeof name == "number") {
      cls = SymbolFactory._SYMBOL_CLASSES["number"];
    } else {
      cls = SymbolFactory._SYMBOL_CLASSES[name] || OperandSymbol;
    }
    const symbol = new cls(name),
      symbols = [symbol];
    if (symbol.paramsNumber > 0) {
      for (let i = symbol.paramsNumber; i > 1; i--) {
        symbols.push(new OperatorSymbols.ParamSeparator());
      }
      symbols.push(new OperatorSymbols.ParamEnd());
    }
    return symbols;
  }

  static createSymbol(clsName: string, value: string): MathSymbol {
    const cls =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>OperatorSymbols)[clsName] || (<any>OperandSymbols)[clsName];
    if (!cls) {
      return SymbolFactory.createPlaceholder();
    } else {
      const symbol = new cls(value);
      return symbol;
    }
  }

  static createCursor(): OperandSymbols.Cursor {
    return new OperandSymbols.Cursor();
  }

  static createPlaceholder(): OperandSymbols.Placeholder {
    return new OperandSymbols.Placeholder();
  }

  static createHiddenTimes(): OperatorSymbols.HiddenTimes {
    return new OperatorSymbols.HiddenTimes();
  }
}
