import Placeholder from "../controls/Placeholder";
import Formula from "../Formula";
import GenericSymbol from "../GenericSymbol";
import MathFunction from "../MathFunction";
import { InFunctionOperations, SymbolOperation } from "../operations";

export default class PowerFunction extends MathFunction {
  needLeft = false;

  constructor(formula: Formula) {
    super(formula, "^", 2);
  }

  getParamsOperation(
    operName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbol: GenericSymbol
  ): SymbolOperation | undefined {
    if (operName == "deleteFromRight") {
      return new DeleteFromRight();
    } else {
      return super.getParamsOperation(operName, symbol);
    }
  }

  afterInsert(leftSymbol: GenericSymbol): GenericSymbol {
    if (leftSymbol.position == 0) {
      leftSymbol.formula?.insertPlaceholder(0);
    }
    leftSymbol.detach();
    if (leftSymbol instanceof Placeholder) {
      return this.params[0][0];
    } else {
      this.params[0].push(leftSymbol);
      return this.params[1][0];
    }
  }

  toLatex(): string {
    const base = "{" + this.params[0].renderLatex(true) + "}",
      power = "{" + this.params[1].renderLatex() + "}";
    return base + this.value + power;
  }
}

class DeleteFromRight extends InFunctionOperations.DeleteFromRight {
  runWithoutLeftSymbol(symbol: GenericSymbol): GenericSymbol {
    const parentFunction = symbol.formula.parentFunction;
    if (!parentFunction) {
      return symbol;
    }
    const parentFunctionParams = parentFunction.params;
    const formulaIndex = parentFunctionParams.indexOf(symbol.formula);
    if (formulaIndex == 1 && symbol.formula.length == 1) {
      /* the power param is only a placeholder, replace the parent math function with base param */
      const baseFormula = parentFunctionParams[0];
      baseFormula.shift(); /* shift the first symbol which is placeholder */
      const lastSymbol = baseFormula[baseFormula.length - 1];
      parentFunction.replaceBy(...baseFormula);
      return lastSymbol;
    } else {
      return super.runWithoutLeftSymbol(symbol);
    }
  }
}
