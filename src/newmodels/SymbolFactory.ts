import MathSymbol from "./MathSymbol";
import OperandSymbol from "./OperandSymbol";
import Cursor from "./operand-symbols/Cursor";
import Placeholder from "./operand-symbols/Placeholder";
import NumberSymbol from "./operand-symbols/NumberSymbol";
import * as OperatorSymbols from "./operator-symbols";

export default class SymbolFactory {
  private static _SYMBOL_CLASSES: {
    [key: string]: typeof MathSymbol;
  } = {
    number: NumberSymbol,
    hidden: OperatorSymbols.HiddenTimes,
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

  static createCursor(): Cursor {
    return new Cursor();
  }

  static createPlaceholder(): Placeholder {
    return new Placeholder();
  }

  static createHiddenTimes(): OperatorSymbols.HiddenTimes {
    return new OperatorSymbols.HiddenTimes();
  }
}
