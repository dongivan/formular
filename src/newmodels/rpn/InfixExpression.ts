import SymbolFactory from "../SymbolFactory";
import MathSymbol from "../MathSymbol";
import OperatorSymbol from "../OperatorSymbol";
import OperandSymbol from "../OperandSymbol";
import ParamSeparator from "../operator-symbols/ParamSeparator";
import ParamEnd from "../operator-symbols/ParamEnd";
import SymbolGroup from "./SymbolGroup";
import Operand from "./Operand";
import Operator from "./Operator";

export default class InfixExpression {
  private _list: SymbolGroup[];

  constructor(symbols: MathSymbol[]) {
    // this._list = [];
    this._list = this._generateInfixList(symbols);
    // console.log(this.toString());
  }

  get length(): number {
    return this._list.length;
  }

  get list(): readonly SymbolGroup[] {
    return Object.freeze(this._list);
  }

  private _generateInfixList(symbols: MathSymbol[]) {
    const infixList: SymbolGroup[] = [];

    if (symbols.length == 0) {
      /* symbols list HAS NO members, just push a "placeholder" and return */
      this._pushOperand(
        infixList,
        new Operand(SymbolFactory.createPlaceholder())
      );
      return infixList;
    }

    let pos = 0,
      operandCache: Operand = new Operand();
    while (pos < symbols.length) {
      const symbol = symbols[pos];
      if (symbol instanceof OperandSymbol) {
        /* the symbol is an OperandSymbol, try to push it in the operand cache */
        if (!operandCache.push(symbol)) {
          /* push failed for the reason that the operand cache IS NOT empty, AND the symbol
          OR the first member of operand cache IS NOT a NumberSymbol object */
          /* push the operand cache into the infix expression and clear the cache */
          this._pushOperand(infixList, operandCache);
          operandCache = new Operand();

          /* push the OperandSymbol object into the operand cache */
          operandCache.push(symbol);
        }
      } else if (symbol instanceof OperatorSymbol) {
        /* the symbol is an OperatorSymbol, check the operand cache */
        if (operandCache.length > 0) {
          /* the operand cache is not empty, push it into infix expression and clear cache */
          this._pushOperand(infixList, operandCache);
          operandCache = new Operand();
        }

        let operatorParams;
        if (symbol.paramsNumber > 0) {
          const { params, endPos } = this._generateParams(pos, symbols);
          operatorParams = params;
          pos = endPos;
        }
        const operator = new Operator(symbol, operatorParams);

        /* push the operator into the infix expression */
        this._pushOperator(infixList, operator);
      }

      pos += 1;
    }

    if (operandCache.length > 0) {
      /* operand cache IS NOT empty, push the operand cache into the infix expression if it is not empty */
      this._pushOperand(infixList, operandCache);
    } else {
      const symbol = symbols[pos - 1];
      if (symbol instanceof OperatorSymbol && symbol.hasRightOperand) {
        /* the last member of infix expression is an OperatorSymbol object which HAS right operand,
          push a placeholder into the infix expression */
        this._pushOperand(
          infixList,
          new Operand(SymbolFactory.createPlaceholder())
        );
      }
    }

    return infixList;
  }

  private _generateParams(
    startPos: number,
    symbols: MathSymbol[]
  ): { params: MathSymbol[][]; endPos: number } {
    let opLvl = 1,
      pos = startPos,
      param: MathSymbol[] = [];
    const params: MathSymbol[][] = [];
    while (pos < symbols.length) {
      pos += 1;
      const item = symbols[pos];

      if (item instanceof ParamSeparator && opLvl == 1) {
        /* current item is param separator ("|") and operator level is 1, so push param into params */
        // params.push(this._generateInfixList(param));
        params.push(param);
        param = [];
        /* continue */
        continue;
      } else if (item instanceof ParamEnd) {
        /* current item is paran end ("]"), operator level -= 1 */
        opLvl -= 1;
        if (opLvl == 0) {
          /* operator level == 0 means all params of current operator have been pushed */
          // params.push(this._generateInfixList(param));
          params.push(param);
          param = [];
          /* break */
          break;
        }
      } else if (item.paramsNumber > 0) {
        /* item has params, so operator level += 1 */
        opLvl += 1;
      }
      param.push(item);
    }
    return { params, endPos: pos };
  }

  private _pushOperator(infixList: SymbolGroup[], operator: Operator) {
    const prevItem = infixList[infixList.length - 1];
    if (!prevItem) {
      if (operator.hasLeftOperand) {
        /* the previous item DOES NOT exist, and the current operator HAS the left operand
        push a operand with "placeholder" into inputs */
        infixList.push(new Operand(SymbolFactory.createPlaceholder()));
      }
    } else {
      if (prevItem instanceof Operand) {
        if (!operator.hasLeftOperand) {
          /* the previous item is an Operand object, and the current operator DOES NOT HAVE
          the left operand, push a "hidden" into inputs */
          infixList.push(new Operator(SymbolFactory.createHiddenTimes()));
        }
      } else if (prevItem instanceof Operator) {
        if (prevItem.hasRightOperand && operator.hasLeftOperand) {
          /* the previous item is an operator which has right operand, and the current operator
          has left operand, push a "placeholder" into inputs */
          infixList.push(new Operand(SymbolFactory.createPlaceholder()));
        } else if (!prevItem.hasRightOperand && !operator.hasLeftOperand) {
          /* the previous item is an operator which DOES NOT HAVE right operand, and the
          current operator DOES NOT HAVE left operand, push a "hidden" into inputs */
          infixList.push(new Operator(SymbolFactory.createHiddenTimes()));
        }
      }
    }

    infixList.push(operator);
  }

  private _pushOperand(infixList: SymbolGroup[], operand: Operand) {
    if (operand.length == 0) {
      return;
    }
    const prevItem = infixList[infixList.length - 1];
    if (
      prevItem instanceof Operand ||
      (prevItem instanceof Operator && !prevItem.hasRightOperand)
    ) {
      /* previous item of inputs is an Operand object, or it is an Operator object and
      it HAS NOT the right operand, push a "hidden" operator into inputs */
      infixList.push(new Operator(SymbolFactory.createHiddenTimes()));
    }
    infixList.push(operand);
  }

  // toJSON(): string {
  //   return (
  //     "[" + this._list.map<string>((symbol) => symbol.toJSON()).join(", ") + "]"
  //   );
  // }
  toString(): string {
    return (
      "[" +
      this._list.map<string>((symbol) => symbol.toString()).join(", ") +
      "]"
    );
  }
}
