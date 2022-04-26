export default class Operator {
  private _value = "";
  private _priority = 0;
  readonly hasLeftOperand = true;
  readonly hasRightOperand = true;

  constructor(value?: string, priority?: number) {
    if (value !== undefined) {
      this._value = value;
    }
    if (priority != undefined) {
      this._priority = priority;
    }
  }

  get priority() {
    return this._priority;
  }

  toLatex() {
    return this._value;
  }
}
