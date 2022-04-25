import GenericSymbol from "../GenericSymbol";
import * as SimpleOperations from "./simple";

export class SendCursorToLeft extends SimpleOperations.SendCursorToLeft {
  runWithoutLeftSymbol(symbol: GenericSymbol): void {
    const cursor = symbol.formula.cursor;
    const parentFunction = symbol.formula.parentFunction;
    if (!parentFunction) {
      return;
    }
    const parentFunctionParams = parentFunction.params;
    const formulaIndex = parentFunctionParams.indexOf(symbol.formula);
    if (formulaIndex == 0) {
      const parentLeftSymbol = parentFunction.leftSymbol;
      /* the first symbol of a formula MUST be a Placeholder */
      parentLeftSymbol?.receiveCursorFromRight(cursor);
    } else {
      const prevFormula = parentFunctionParams[formulaIndex - 1];
      prevFormula[prevFormula.length - 1].receiveCursorFromRight(cursor);
    }
  }
}

export class SendCursorToRight extends SimpleOperations.SendCursorToRight {
  runWithoutRightSymbol(symbol: GenericSymbol): void {
    const cursor = symbol.formula.cursor;
    const parentFunction = symbol.formula.parentFunction;
    if (!parentFunction) {
      return;
    }
    const parentFunctionParams = parentFunction.params;
    const formulaIndex = parentFunctionParams.indexOf(symbol.formula);
    if (formulaIndex == parentFunctionParams.length - 1) {
      /* parent(MathFunction) should receive cursor like from right */
      parentFunction.receiveCursorFromRight(cursor);
    } else {
      const prevFormula = parentFunctionParams[formulaIndex + 1];
      prevFormula[0].receiveCursorFromLeft(cursor);
    }
  }
}

export class DeleteFromRight extends SimpleOperations.DeleteFromRight {
  runWithoutLeftSymbol(symbol: GenericSymbol): GenericSymbol {
    const parentFunction = symbol.formula.parentFunction;
    if (!parentFunction) {
      return symbol;
    }
    const parentFunctionParams = parentFunction.params;
    const formulaIndex = parentFunctionParams.indexOf(symbol.formula);
    if (formulaIndex > 0) {
      const prevFormula = parentFunctionParams[formulaIndex - 1];
      return prevFormula[prevFormula.length - 1];
    } else {
      const leftSymbol = parentFunction.leftSymbol;
      if (leftSymbol) {
        parentFunction.detach();
        return leftSymbol;
      } else {
        return symbol;
      }
    }
  }
}
