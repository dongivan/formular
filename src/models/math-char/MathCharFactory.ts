import MathChar from "./MathChar";
import * as OperandChars from "./operand-chars";
import * as OperatorChars from "./operator-chars";

type CreateCommand = (
  | {
      create: (
        factory: MathCharFactory,
        cursor?: OperandChars.Cursor
      ) => [MathChar, ...MathChar[]];
    }
  | {
      class: typeof MathChar;
    }
) & {
  aliases: string[];
};

const classCommand = function (
  cls: typeof MathChar,
  aliases: string[] = []
): CreateCommand {
  return {
    class: cls,
    aliases,
  };
};

const commands: CreateCommand[] = [
  classCommand(OperatorChars.Plus, ["+", "plus"]),
  classCommand(OperatorChars.Minus, ["-", "minus"]),
  classCommand(OperatorChars.Times, ["*", "times", "multiple"]),
  classCommand(OperatorChars.Divide, ["/", "divide"]),
  classCommand(OperatorChars.LeftParen, ["(", "left-paren"]),
  classCommand(OperatorChars.RightParen, [")", "right-paren"]),
  classCommand(OperatorChars.Power, ["^", "power"]),
  classCommand(OperatorChars.Factorial, ["!", "factorial"]),

  classCommand(OperandChars.Infinity, ["infinity"]),
  classCommand(OperandChars.DecimalPoint, [".", "point"]),
  classCommand(OperandChars.SquareRoot, ["sqrt", "square-root"]),
  classCommand(OperandChars.Fraction, ["frac", "fraction"]),
  classCommand(OperandChars.Ln, ["ln"]),
  classCommand(OperandChars.Sum, ["sum"]),
  classCommand(OperandChars.IIntegral, ["i-integral"]),
  classCommand(OperandChars.Differential, ["differential", "dif"]),
  classCommand(OperandChars.Combination, ["combination"]),

  {
    aliases: ["square"],
    create: (factory, cursor) => {
      const chars = factory.create("power");
      chars.splice(1, 0, ...factory.create("2"));
      if (cursor) {
        chars.push(cursor);
      }
      return chars;
    },
  },
];

class MathCharFactory {
  private static _COMMANDS: {
    [key: string]: CreateCommand;
  } = {};

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

  static init() {
    if (Object.keys(MathCharFactory._COMMANDS).length == 0) {
      commands.forEach((command) => {
        command.aliases.forEach((alias) => {
          MathCharFactory._COMMANDS[alias] = command;
        });
      });
    }
  }

  constructor() {
    this._cursor = this._afterCreate(new OperandChars.Cursor())[0];
    this._hidden = this._afterCreate(new OperatorChars.HiddenTimes())[0];
  }

  create(
    commandAlias: string,
    cursor?: OperandChars.Cursor
  ): [MathChar, ...MathChar[]] {
    let command: CreateCommand;
    if (/^[0-9]$/.test(commandAlias)) {
      command = classCommand(OperandChars.Digit);
    } else {
      command = MathCharFactory._COMMANDS[commandAlias];
    }

    if (!command) {
      command = classCommand(OperandChars.Variable);
    }
    let chars: [MathChar, ...MathChar[]];
    if ("class" in command) {
      chars = this._afterCreate(new command.class(commandAlias));
      const char = chars[0];
      if (char.paramsNumber > 0) {
        for (let i = char.paramsNumber; i > 1; i--) {
          chars.push(...this._afterCreate(new OperatorChars.ParamSeparator()));
        }
        chars.push(...this._afterCreate(new OperatorChars.ParamEnd()));
      }
      if (cursor) {
        if (char.paramsNumber > 0) {
          chars.splice(1, 0, cursor);
        } else {
          chars.push(cursor);
        }
      }
    } else {
      chars = this._afterCreate(...command.create(this, cursor));
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
      )[0];
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

  createTempParen(): [OperatorChars.LeftParen, OperatorChars.RightParen] {
    return [
      new OperatorChars.LeftParen("", -1),
      new OperatorChars.RightParen("", -1),
    ];
  }

  private _afterCreate<T extends MathChar>(...chars: [T, ...T[]]): [T, ...T[]] {
    chars.forEach((char) => {
      this._chars[char.sequenceNumber] = char;
    });
    return chars;
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

MathCharFactory.init();

export default MathCharFactory;
