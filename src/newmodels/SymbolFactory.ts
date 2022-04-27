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
  };

  static create(name: string | number) {
    let cls;
    if (typeof name == "number") {
      cls = SymbolFactory._SYMBOL_CLASSES["number"];
    } else {
      cls = SymbolFactory._SYMBOL_CLASSES[name] || OperandSymbol;
    }
    return new cls(name);
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
