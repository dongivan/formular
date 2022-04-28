import MathSymbol from "../MathSymbol";

export default abstract class SymbolGroup {
  protected _params: MathSymbol[][];

  constructor(params: MathSymbol[][] | undefined) {
    this._params = params || [];
  }

  set params(groups: MathSymbol[][]) {
    this._params = groups;
  }

  get params(): MathSymbol[][] {
    return this._params;
  }

  get hasParams(): boolean {
    return this._params.length > 0;
  }

  abstract get symbols(): MathSymbol[];
}
