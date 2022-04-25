import GenericSymbol from "../GenericSymbol";
import SymbolOperation from "./SymbolOperation";

export class SendCursorToLeft extends SymbolOperation {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  runWithoutLeftSymbol(symbol: GenericSymbol): void {
    /* */
  }

  run(symbol: GenericSymbol): void {
    const cursor = symbol.formula.cursor;
    if (cursor.symbol !== symbol) {
      cursor.symbol = symbol;
    }
    const leftSymbol = symbol.leftSymbol;
    if (leftSymbol) {
      leftSymbol.receiveCursorFromRight(cursor);
    } else {
      this.runWithoutLeftSymbol(symbol);
    }
  }
}

export class SendCursorToRight extends SymbolOperation {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  runWithoutRightSymbol(symbol: GenericSymbol): void {
    /* */
  }

  run(symbol: GenericSymbol): void {
    const cursor = symbol.formula.cursor;
    if (cursor.symbol !== symbol) {
      cursor.symbol = symbol;
    }
    const rightSymbol = symbol.rightSymbol;
    if (rightSymbol) {
      rightSymbol.receiveCursorFromLeft(cursor);
    } else {
      this.runWithoutRightSymbol(symbol);
    }
  }
}

export class DeleteFromRight extends SymbolOperation {
  runWithoutLeftSymbol(symbol: GenericSymbol) {
    return symbol;
  }

  run(symbol: GenericSymbol): GenericSymbol {
    const leftSymbol = symbol.leftSymbol;
    if (leftSymbol) {
      symbol.detach();
      return leftSymbol;
    } else {
      return this.runWithoutLeftSymbol(symbol);
    }
  }
}
