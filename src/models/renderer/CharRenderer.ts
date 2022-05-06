import { AbstractParen, MathChar } from "../math-char";

export default abstract class CharRenderer<T> {
  protected _interactive: boolean;

  constructor(interactive = true) {
    this._interactive = interactive;
  }

  protected abstract _render(char: MathChar, params: T[]): T;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _addClickableMark(t: T, sn: number): T {
    return t;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _setParenthesesLevel(t: T, level: number): T {
    return t;
  }

  render(char: MathChar, params?: T[]): T {
    let result = this._render(char, params || []);

    if (char instanceof AbstractParen && this._setParenthesesLevel) {
      result = this._setParenthesesLevel(result, char.level);
    }

    if (char.clickable && this._interactive) {
      result = this._addClickableMark(result, char.sequenceNumber);
    }

    return result;
  }
}
