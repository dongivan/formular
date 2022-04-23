import BaseSymbol from "./BaseSymbol";
import * as MathFunctions from "./functions";
import UnknownSymbol from "./UnknownSymbol";
import Formula from "./Formula";
import NumberSymbol from "./NumberSymbol";

export default class Symbols {
  private static repo: {
    [key: string]: (parent: Formula) => BaseSymbol;
  } = {};

  static init(): void {
    this.repo["power"] = (parent: Formula) => new MathFunctions.Power(parent);
  }

  static makeSymbol(value: string | number, parent: Formula): BaseSymbol {
    if (typeof value == "number") {
      return new NumberSymbol(value.toString());
    }
    const makeSymbolFn = this.repo[value];
    if (makeSymbolFn) {
      return makeSymbolFn(parent);
    } else {
      return new UnknownSymbol(value);
    }
  }
}
