// import Symbols from "./Symbols";
import GenericSymbol from "./GenericSymbol";

export default class Cursor {
  symbol: GenericSymbol;

  constructor(symbol: GenericSymbol) {
    this.symbol = symbol;
  }

  insertSymbol(symbolName: string | number): void {
    const newSymbol = this.symbol.insertOnRight(symbolName);
    newSymbol.receiveCursorFromLeft(this);
  }

  moveLeft(): void {
    this.symbol.sendCursorToLeft(this);
  }

  moveRight(): void {
    this.symbol.sendCursorToRight(this);
  }

  renderLatex(): string {
    return "{\\htmlClass{formular-cursor}{\\ \\ \\ }}";
  }
}
