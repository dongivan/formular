import GenericSymbol from "./GenericSymbol";
import * as MathFunctions from "./functions";
import UnknownSymbol from "./UnknownSymbol";
import Formula from "./Formula";
import NumberSymbol from "./NumberSymbol";

export default class Symbols {
  private static repo: {
    [key: string]: (formula: Formula) => GenericSymbol;
  } = {};

  static init(): void {
    this.repo["power"] = (formula: Formula) => new MathFunctions.Power(formula);
  }

  static makeSymbol(formula: Formula, value: string | number): GenericSymbol {
    if (typeof value == "number") {
      return new NumberSymbol(formula, value.toString());
    }
    const makeSymbolFn = this.repo[value];
    if (makeSymbolFn) {
      return makeSymbolFn(formula);
    } else {
      return new UnknownSymbol(formula, value);
    }
  }
}
