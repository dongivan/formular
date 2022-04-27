import Cursor from "./operand-symbols/Cursor";
import MathSymbol from "./MathSymbol";
import NumberSymbol from "./operand-symbols/NumberSymbol";
import OperandSymbol from "./OperandSymbol";
import HiddenTimes from "./operator-symbols/HiddenTimes";
import Plus from "./operator-symbols/Plus";
import Placeholder from "./operand-symbols/Placeholder";
import LeftParen from "./operator-symbols/LeftParen";
import RightParen from "./operator-symbols/RightParen";

export default class SymbolFactory {
  private static _SYMBOL_CLASSES: {
    [key: string]: typeof MathSymbol;
  } = {
    number: NumberSymbol,
    hidden: HiddenTimes,
    "+": Plus,
    "(": LeftParen,
    ")": RightParen,
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

  static createHiddenTimes(): HiddenTimes {
    return new HiddenTimes();
  }
}
