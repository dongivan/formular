import Operand from "./Operand";
import OperandSymbol from "./OperandSymbol";
import OperatorSymbol from "./OperatorSymbol";
import SymbolContainer from "./SymbolContainer";
import SymbolFactory from "./SymbolFactory";

/* Base on Shunting Yard Algorithm */
export default class RPNList {
  private _list: (Operand | OperatorSymbol)[] = [];

  constructor(container: SymbolContainer) {
    this._init(container);
  }

  /* shunting yard:
    output list: this._list,
    operator stack: operatorStack.
   */
  private _init(container: SymbolContainer) {
    const operatorStack: OperatorSymbol[] = [];
    let pos = 0,
      operandCache: Operand = new Operand();
    while (pos < container.length) {
      /* traverse each symbol in the container */
      const symbol = container.get(pos);
      if (symbol instanceof OperandSymbol) {
        /* if the symbol is an OperandSymbol, try to push it in the operand cache */
        if (!operandCache.push(symbol)) {
          /* push failed for the reason that the operand cache IS NOT empty, and the symbol 
          OR the first member of operand cache IS NOT a Number object */
          /* push the operand cache into the output list and clear the cache */
          this._list.push(operandCache);
          operandCache = new Operand();
          /* push a "hidden" operator (with same priority as times or divide) into the operator stack */
          this._pushOperatorIntoStack(
            SymbolFactory.create("hidden") as OperatorSymbol,
            operatorStack
          );
          /* push the OperandSymbol object into the operand cache */
          operandCache.push(symbol);
        }
      } else if (symbol instanceof OperatorSymbol) {
        /* if the symbol is an OperatorSymbol, check the operand cache */
        if (operandCache.length > 0) {
          /* the operand cache is not empty, push it into output list and clear cache */
          this._list.push(operandCache);
          operandCache = new Operand();
        } else if (symbol.hasLeftOperand) {
          /* the operand cache is empty (which means there are no OperandSymbol after previous OperatorSymbol,
            or the first member of container is OperatorSymbol), and the current symbol (which is an OperatorSymbol
            object) has a left operand, so push a placeholder into the output list */
          /*  */
          this._list.push(new Operand(SymbolFactory.createPlaceholder()));
        }
        /* push the OperatorSymbol object into operator stack */
        this._pushOperatorIntoStack(symbol, operatorStack);
      }

      pos += 1;
    }

    /* the container traverse done */

    if (operandCache.length > 0) {
      /* operand cache IS NOT empty, push the operand cache into the output list if it is not empty */
      this._list.push(operandCache);
    } else {
      const symbol = container.get(container.length - 1);
      if (symbol instanceof OperatorSymbol && symbol.hasRightOperand) {
        /* the last member of container is an OperatorSymbol object and has right operand */
        /* push a placeholder into the output list */
        this._list.push(new Operand(SymbolFactory.createPlaceholder()));
      }
    }

    /* push every operator of the operator stack into the output list */
    while (operatorStack.length > 0) {
      this._list.push(operatorStack[0]);
      operatorStack.shift();
    }
  }

  private _pushOperatorIntoStack(
    operator: OperatorSymbol,
    operatorStack: OperatorSymbol[]
  ) {
    /* pop operators from the operator stack until the priority of the top operator is less than the operator's
     and push them into the output list */
    while (
      operatorStack.length > 0 &&
      operatorStack[0].priority >= operator.priority
    ) {
      this._list.push(operatorStack[0]);
      operatorStack.shift();
    }
    operatorStack.unshift(operator);
  }

  get output(): readonly (Operand | OperatorSymbol)[] {
    return Object.freeze(this._list);
  }
}
