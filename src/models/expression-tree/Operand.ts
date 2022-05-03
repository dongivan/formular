import MathChar from "../MathChar";
import NumberChar from "../operand-chars/NumberChar";
import OperandChar from "../OperandChar";
import SymbolGroup from "./SymbolGroup";

export default class Operand extends SymbolGroup {
  private _chars: OperandChar[] = [];

  constructor(...chars: OperandChar[]) {
    super(undefined);
    chars.forEach((char) => this._chars.push(char));
  }

  push(char: OperandChar): boolean {
    if (
      this._chars.length == 0 ||
      (char instanceof NumberChar &&
        this._chars[this._chars.length - 1] instanceof NumberChar)
    ) {
      this._chars.push(char);
      return true;
    } else {
      return false;
    }
  }

  get length(): number {
    return this._chars.length;
  }

  get chars(): MathChar[] {
    return this._chars;
  }

  toString(): string {
    return this._chars.map<string>((char) => char.toString()).join("");
  }
}
