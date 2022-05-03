import MathChar from "../MathChar";

export default abstract class MathSymbol {
  protected _params: MathChar[][];

  constructor(params: MathChar[][] | undefined) {
    this._params = params || [];
  }

  set params(groups: MathChar[][]) {
    this._params = groups;
  }

  get params(): MathChar[][] {
    return this._params;
  }

  get hasParams(): boolean {
    return this._params.length > 0;
  }

  abstract get chars(): MathChar[];
}
