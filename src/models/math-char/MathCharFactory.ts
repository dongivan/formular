import MathChar from "./MathChar";
import OperandChar from "./OperandChar";
import * as OperandChars from "./operand-chars";
import * as OperatorChars from "./operator-chars";

export default class MathCharFactory {
  private static _CHAR_CLASSES: {
    [key: string]: typeof MathChar;
  } = {
    /* operand chars */
    digit: OperandChars.Digit,
    hidden: OperatorChars.HiddenTimes,
    sqrt: OperandChars.SquareRoot,
    over: OperandChars.Over,
    ".": OperandChars.DecimalPoint,

    /* operator chars */
    "+": OperatorChars.Plus,
    "-": OperatorChars.Minus,
    "*": OperatorChars.Times,
    "/": OperatorChars.Divide,
    "(": OperatorChars.LeftParen,
    ")": OperatorChars.RightParen,
    "^": OperatorChars.Power,
  };

  private _chars: {
    [key: number]: MathChar;
  } = {};
  private _cursor: OperandChars.Cursor;
  private _hidden: OperatorChars.HiddenTimes;
  private _placeholders: {
    [masterSequenceNumber: number]: {
      left: OperandChars.Placeholder;
      right: OperandChars.Placeholder;
    };
  } = {};

  constructor() {
    this._cursor = this._afterCreate(new OperandChars.Cursor());
    this._hidden = this._afterCreate(new OperatorChars.HiddenTimes());
  }

  create(name: string | number): MathChar[] {
    let cls;
    if (typeof name == "number") {
      cls = MathCharFactory._CHAR_CLASSES.digit;
    } else {
      cls = MathCharFactory._CHAR_CLASSES[name] || OperandChar;
    }
    const char = this._afterCreate(new cls(name)),
      chars = [char];
    if (char.paramsNumber > 0) {
      for (let i = char.paramsNumber; i > 1; i--) {
        chars.push(this._afterCreate(new OperatorChars.ParamSeparator()));
      }
      chars.push(this._afterCreate(new OperatorChars.ParamEnd()));
    }
    return chars;
  }

  createCursor(): OperandChars.Cursor {
    return this._cursor;
  }

  createPlaceholder(
    master: MathChar,
    leftOrRight: "left" | "right"
  ): OperandChars.Placeholder {
    let char = (this._placeholders[master.sequenceNumber] || {})[leftOrRight];
    if (!char) {
      char = this._afterCreate(
        new OperandChars.Placeholder(master, leftOrRight == "left" ? -1 : 1)
      );
      this._placeholders[master.sequenceNumber] = Object.assign(
        {},
        this._placeholders[master.sequenceNumber] || {},
        { [leftOrRight]: char }
      );
    }
    return char;
  }

  createHiddenTimes(): OperatorChars.HiddenTimes {
    return this._hidden;
  }

  private _afterCreate<T extends MathChar>(char: T): T {
    this._chars[char.sequenceNumber] = char;
    return char;
  }

  findCharBySequenceNumber(sequenceNumber: number): MathChar {
    return this._chars[sequenceNumber];
  }

  clearCharsAfterSequenceNumber(sequenceNumber: number): void {
    Object.keys(this._chars).forEach((key) => {
      const sn = parseInt(key),
        char = this._chars[sn];
      if (!char || char instanceof OperandChars.Placeholder) {
        return;
      }
      if (sn > sequenceNumber) {
        delete this._chars[sn];
        const placeholders = this._placeholders[sn];
        if (placeholders) {
          if (placeholders.left) {
            delete this._chars[placeholders.left.sequenceNumber];
          }
          if (placeholders.right) {
            delete this._chars[placeholders.right.sequenceNumber];
          }
          delete this._placeholders[sn];
        }
      }
    });
  }
}
