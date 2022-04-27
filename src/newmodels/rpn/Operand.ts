import NumberSymbol from "../operand-symbols/NumberSymbol";
import OperandSymbol from "../OperandSymbol";

export default class Operand {
  private _list: OperandSymbol[] = [];

  constructor(...symbols: OperandSymbol[]) {
    symbols.forEach((symbol) => this._list.push(symbol));
  }

  push(symbol: OperandSymbol): boolean {
    if (
      this._list.length == 0 ||
      (symbol instanceof NumberSymbol &&
        this._list[this._list.length - 1] instanceof NumberSymbol)
    ) {
      this._list.push(symbol);
      return true;
    } else {
      return false;
    }
  }

  get length(): number {
    return this._list.length;
  }

  toLatex(): string {
    return this._list.map<string>((symbol) => symbol.toLatex()).join("");
  }

  toJSON(): string {
    return (
      "[" + this._list.map<string>((symbol) => symbol.toJSON()).join(", ") + "]"
    );
  }
}
