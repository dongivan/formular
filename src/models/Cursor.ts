import GenericSymbol from "./GenericSymbol";

export default class Cursor {
  symbol: GenericSymbol;

  constructor(symbol: GenericSymbol) {
    this.symbol = symbol;
  }

  insertSymbol(symbolName: string | number): void {
    const newSymbol = this.symbol.insertOnRight(symbolName);
    if (newSymbol !== this.symbol) {
      newSymbol.receiveCursorFromLeft(this);
    }
  }

  deleteSymbol(): void {
    const symbol = this.symbol.deleteFromRight();
    this.symbol = symbol;
  }

  moveLeft(): void {
    this.symbol.sendCursorToLeft();
  }

  moveRight(): void {
    this.symbol.sendCursorToRight();
  }

  renderLatex(): string {
    return "{\\htmlClass{formular-cursor}{\\ \\ \\ }}";
  }
}
