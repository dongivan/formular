import Operand from "./Operand";
import OperatorSymbol from "../OperatorSymbol";
import SymbolFactory from "../SymbolFactory";
import OperandSymbol from "../OperandSymbol";
import SymbolContainer from "../SymbolContainer";

export default class InfixExpression {
  private _list: (Operand | OperatorSymbol)[] = [];

  constructor(container: SymbolContainer) {
    let pos = 0,
      operandCache: Operand = new Operand();
    while (pos < container.length) {
      const symbol = container.get(pos);
      if (symbol instanceof OperandSymbol) {
        /* the symbol is an OperandSymbol, try to push it in the operand cache */
        if (!operandCache.push(symbol)) {
          /* push failed for the reason that the operand cache IS NOT empty, AND the symbol 
          OR the first member of operand cache IS NOT a NumberSymbol object */
          /* push the operand cache into the infix expression and clear the cache */
          this._pushOperand(operandCache);
          operandCache = new Operand();

          /* push the OperandSymbol object into the operand cache */
          operandCache.push(symbol);
        }
      } else if (symbol instanceof OperatorSymbol) {
        /* the symbol is an OperatorSymbol, check the operand cache */
        if (operandCache.length > 0) {
          /* the operand cache is not empty, push it into infix expression and clear cache */
          this._pushOperand(operandCache);
          operandCache = new Operand();
        }

        /* push the operator into the infix expression */
        this._pushOperatorSymbol(symbol);
      }

      pos += 1;
    }

    if (operandCache.length > 0) {
      /* operand cache IS NOT empty, push the operand cache into the infix expression if it is not empty */
      this._pushOperand(operandCache);
    } else {
      const symbol = container.get(pos - 1);
      if (symbol instanceof OperatorSymbol && symbol.hasRightOperand) {
        /* the last member of infix expression is an OperatorSymbol object which HAS right operand,
          push a placeholder into the infix expression */
        this._pushOperand(new Operand(SymbolFactory.createPlaceholder()));
      }
    }
    console.log(this.toJSON());
  }

  get length(): number {
    return this._list.length;
  }

  get(pos: number): Operand | OperatorSymbol | undefined {
    return this._list[pos];
  }

  private _pushOperatorSymbol(operator: OperatorSymbol) {
    const prevItem = this._list[this._list.length - 1];
    if (!prevItem) {
      if (operator.hasLeftOperand) {
        /* the previous item DOES NOT exist, and the current operator HAS the left operand
        push a operand with "placeholder" into inputs */
        this._list.push(new Operand(SymbolFactory.createPlaceholder()));
      }
    } else {
      if (prevItem instanceof Operand) {
        if (!operator.hasLeftOperand) {
          /* the previous item is an Operand object, and the current operator DOES NOT HAVE
          the left operand, push a "hidden" into inputs */
          this._list.push(SymbolFactory.createHiddenTimes());
        }
      } else if (prevItem instanceof OperatorSymbol) {
        if (prevItem.hasRightOperand && operator.hasLeftOperand) {
          /* the previous item is an operator which has right operand, and the current operator
          has left operand, push a "placeholder" into inputs */
          this._list.push(new Operand(SymbolFactory.createPlaceholder()));
        } else if (!prevItem.hasRightOperand && !prevItem.hasLeftOperand) {
          /* the previous item is an operator which DOES NOT HAVE right operand, and the
          current operator DOES NOT HAVE left operand, push a "hidden" into inputs */
          this._list.push(SymbolFactory.createHiddenTimes());
        }
      }
    }

    this._list.push(operator);
  }

  private _pushOperand(operand: Operand) {
    const prevItem = this._list[this._list.length - 1];
    if (
      prevItem instanceof Operand ||
      (prevItem instanceof OperatorSymbol && !prevItem.hasRightOperand)
    ) {
      /* previous item of inputs is an Operand object, or it is an OperatorSymbol object and
      it HAS NOT the right operand, push a "hidden" operator into inputs */
      this._list.push(SymbolFactory.createHiddenTimes());
    }
    this._list.push(operand);
  }

  toJSON(): string {
    return (
      "[" + this._list.map<string>((symbol) => symbol.toJSON()).join(", ") + "]"
    );
  }
}
