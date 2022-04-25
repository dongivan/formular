import Cursor from "./Cursor";
import GenericSymbol from "./GenericSymbol";
import Symbols from "./Symbols";

export default class NumberSymbol extends GenericSymbol {
  insertOnRight(symbolName: string | number): GenericSymbol {
    if (typeof symbolName == "number") {
      this.append(symbolName);
      return this;
    } else {
      return super.insertOnRight(symbolName);
    }
  }

  deleteFromRight(): GenericSymbol {
    if (this.length == 1) {
      return super.deleteFromRight();
    } else {
      this.pop();
      return this;
    }
  }

  sendCursorToLeft(): void {
    if (!this.formula) {
      return;
    }
    const cursor = this.formula.rootFormula.cursor;
    if (cursor.symbol != this) {
      cursor.symbol = this;
    }
    const tail = parseInt(this.pop());
    const rightSymbol = this.rightSymbol;
    if (rightSymbol instanceof NumberSymbol) {
      rightSymbol.unshift(tail);
    } else {
      const newSymbol = Symbols.makeSymbol(this.formula, tail);
      this.formula.insert(this.position + 1, newSymbol);
    }
    if (this.length == 0) {
      super.sendCursorToLeft();
      this.detach();
    }
  }

  sendCursorToRight(): void {
    if (!this.formula) {
      return;
    }
    const cursor = this.formula.rootFormula.cursor;
    if (cursor.symbol != this) {
      cursor.symbol = this;
    }
    const rightSymbol = this.rightSymbol;
    if (rightSymbol instanceof NumberSymbol) {
      const head = parseInt(rightSymbol.shift());
      this.append(head);

      if (rightSymbol.length == 0) {
        rightSymbol.detach();
      }
    } else {
      super.sendCursorToRight();
    }
  }

  receiveCursorFromLeft(cursor: Cursor): void {
    if (!this.formula) {
      return;
    }
    if (this.length == 1) {
      super.receiveCursorFromLeft(cursor);
    } else {
      const head = parseInt(this.shift());
      const newSymbol = Symbols.makeSymbol(this.formula, head);
      this.formula.insert(this.position, newSymbol);
      newSymbol.receiveCursorFromLeft(cursor);
    }
  }

  append(value: number) {
    this.value += value.toString();
  }

  unshift(value: number) {
    this.value = value.toString() + this.value;
  }

  pop() {
    const tail = this.value.slice(-1);
    this.value = this.value.slice(0, -1);
    return tail;
  }

  shift() {
    const head = this.value.slice(0, 1);
    this.value = this.value.slice(1);
    return head;
  }

  get length() {
    return this.value.length;
  }
}
