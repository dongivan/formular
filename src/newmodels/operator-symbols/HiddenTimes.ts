import OperatorSymbol from "../OperatorSymbol";

export default class HiddenTimes extends OperatorSymbol {
  constructor() {
    super("");
    this._priority = 2;
  }

  toJSON(): string {
    return "·";
  }
}
