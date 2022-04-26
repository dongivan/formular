const CURSOR = "cursor";

type SymbolContainer = Array<string | number>;

export default class SymbolList {
  _symbols: SymbolContainer = [];

  constructor() {
    this._symbols.push(CURSOR);
  }

  insert(symbol: string | number): void {
    const cursorPosition = this._symbols.indexOf(CURSOR);
    this._symbols.splice(cursorPosition, 0, symbol);
  }

  private _moveCursor(direction: number): void {
    const cursorPosition = this._symbols.indexOf(CURSOR);
    const newPosition = cursorPosition + direction;
    if (newPosition < 0 || newPosition >= this._symbols.length) {
      return;
    }
    this._symbols.splice(cursorPosition, 1);
    this._symbols.splice(newPosition, 0, CURSOR);
  }

  moveCursorLeft(): void {
    this._moveCursor(-1);
  }

  moveCursorRight(): void {
    this._moveCursor(1);
  }

  toRPN(): Array<string> {
    const array: Array<string> = [],
      stack = [];
    let pos = 0,
      combine = false;
    while (pos < this._symbols.length) {
      const symbol = this._symbols[pos];
      if (typeof symbol == "number") {
        if (combine == false) {
          array.push(symbol.toString());
          combine = true;
        } else {
          array[array.length - 1] += symbol.toString();
        }
      } else if (symbol == CURSOR) {
        combine = false;
        array.push(symbol);
      } else {
        combine = false;
        const operatorPriority =
          {
            "+": 0,
            "-": 0,
            "*": 1,
            "/": 1,
          }[symbol.toString()] || 0;
        while (stack.length > 0 && stack[0][1] >= operatorPriority) {
          const temp = stack.pop();
          if (temp !== undefined) {
            array.push(temp[0].toString());
          }
        }
        stack.push([symbol, operatorPriority]);
      }
      pos++;
    }
    while (stack.length > 0) {
      const symbol = stack.pop();
      if (symbol !== undefined) {
        array.push(symbol[0].toString());
      }
    }
    return array;
  }

  toLatex(): string {
    const rpn = this.toRPN();
    const stack: Array<string> = [];
    let result = "";
    while (rpn.length > 0) {
      const symbol = rpn.shift();
      if (symbol === undefined) {
        continue;
      }
      if (parseInt(symbol) == (symbol || 0)) {
        stack.push(symbol);
      } else if (symbol == CURSOR) {
        stack.push("{\\htmlClass{formular-cursor}{\\ \\ \\ }}");
      } else {
        const right = stack.pop() || "";
        const left = stack.pop() || "";
        result += left + (symbol || "") + right;
      }
    }
    return stack.join("") + result;
  }
}
