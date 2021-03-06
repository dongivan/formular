import { Instance } from "../InstanceResolver";
import {
  Cursor,
  Digit,
  HiddenTimes,
  LeftParen,
  MathChar,
  ParamEnd,
  ParamSeparator,
  Placeholder,
  RightParen,
  Variable,
  MathFunction,
} from "./internal";

type CreateCommandFunction = (
  factory: MathCharFactory,
  cursor?: Cursor
) => [MathChar, ...MathChar[]];

const createCommands: Record<string, CreateCommandFunction | typeof MathChar> =
  {};

function registerCreateFunctionDecorator(
  aliases: string | [string, ...string[]],
  fn: CreateCommandFunction
) {
  return <T extends typeof MathChar>(constructor: T) => {
    const keys = Array.isArray(aliases) ? aliases : [aliases];
    keys.forEach((alias) => {
      createCommands[alias] = fn;
    });
    return constructor;
  };
}

/**
 * Register a subclass of `MathChar` to `MathCharFactory` with aliases, so that an
 * instance of the subclass could be created when `MathCharFactory.create(alias)`
 * called.
 *
 * @param aliases the alias commands of the subclass
 * @returns the constructor of the subclass
 */
function registerMathCharDecorator(...aliases: [string, ...string[]]) {
  return <T extends typeof MathChar>(constructor: T) => {
    aliases.forEach((alias) => {
      createCommands[alias] = constructor;
    });
    return constructor;
  };
}

export default class MathCharFactory extends Instance {
  static RegisterMathChar = registerMathCharDecorator;

  static RegisterCreateFunction = registerCreateFunctionDecorator;

  private _chars: {
    [key: number]: MathChar;
  } = {};
  private _cursor: Cursor;
  private _hidden: HiddenTimes;
  private _placeholders: {
    [masterSequenceNumber: number]: {
      left: Placeholder;
      right: Placeholder;
    };
  } = {};

  constructor() {
    super();

    this._cursor = this._afterCreate(new Cursor())[0];
    this._hidden = this._afterCreate(new HiddenTimes())[0];
  }

  create(commandAlias: string, cursor?: Cursor): [MathChar, ...MathChar[]] {
    let command: CreateCommandFunction | typeof MathChar;
    if (/^[0-9]$/.test(commandAlias)) {
      command = Digit;
    } else {
      command = createCommands[commandAlias];
    }

    if (!command) {
      command = commandAlias.slice(-2) == "()" ? MathFunction : Variable;
    }
    let chars: [MathChar, ...MathChar[]];
    if (command.prototype instanceof MathChar || command === MathChar) {
      chars = this._afterCreate(new (command as typeof MathChar)(commandAlias));
      const char = chars[0];
      if (char.paramsNumber > 0) {
        for (let i = char.paramsNumber; i > 1; i--) {
          chars.push(...this._afterCreate(new ParamSeparator()));
        }
        chars.push(...this._afterCreate(new ParamEnd()));
      }
      if (cursor) {
        if (char.paramsNumber > 0) {
          chars.splice(1, 0, cursor);
        } else {
          chars.push(cursor);
        }
      }
    } else {
      chars = this._afterCreate(
        ...(command as CreateCommandFunction)(this, cursor)
      );
    }
    return chars;
  }

  createCursor(): Cursor {
    return this._cursor;
  }

  createPlaceholder(
    master: MathChar,
    leftOrRight: "left" | "right"
  ): Placeholder {
    let char = (this._placeholders[master.sequenceNumber] || {})[leftOrRight];
    if (!char) {
      char = this._afterCreate(
        new Placeholder({ master, offset: leftOrRight == "left" ? -1 : 1 })
      )[0];
      this._placeholders[master.sequenceNumber] = {
        ...this._placeholders[master.sequenceNumber],
        [leftOrRight]: char,
      };
    }
    return char;
  }

  createHiddenTimes(): HiddenTimes {
    return this._hidden;
  }

  createPhontomParens(): [LeftParen, RightParen] {
    return [
      new LeftParen({ phontom: true }),
      new RightParen({ phontom: true }),
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
      if (!char || char instanceof Placeholder) {
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
