import MathSymbol from "../MathSymbol";
import NumberSymbol from "../operand-symbols/NumberSymbol";
import OperandSymbol from "../OperandSymbol";
import SymbolGroup from "./SymbolGroup";

export default class Operand extends SymbolGroup {
  private _list: OperandSymbol[] = [];

  constructor(...symbols: OperandSymbol[]) {
    super(undefined);
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

  set params(groups: MathSymbol[][]) {
    this._params = groups;
  }

  get symbols(): MathSymbol[] {
    return this._list;
  }

  toString(): string {
    return this._list.map<string>((symbol) => symbol.toString()).join("");
  }
}
