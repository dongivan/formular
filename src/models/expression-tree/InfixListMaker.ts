import MathChar from "../MathChar";
import OperatorChar from "../OperatorChar";
import OperandChar from "../OperandChar";
import ParamSeparator from "../operator-chars/ParamSeparator";
import ParamEnd from "../operator-chars/ParamEnd";
import OperandSymbol from "./OperandSymbol";
import OperatorSymbol from "./OperatorSymbol";
import Formula from "../Formula";
import InfixList from "./InfixList";

export default class InfixListMaker {
  private _formula: Formula;

  constructor(formula: Formula) {
    this._formula = formula;
  }

  make(chars: MathChar[]): InfixList {
    return this._generateInfixList(chars);
  }

  private _generateInfixList(chars: MathChar[]): InfixList {
    const infixList: InfixList = [];

    let pos = 0,
      operandCache: OperandSymbol = new OperandSymbol();
    while (pos < chars.length) {
      const char = chars[pos];
      let operatorParams = undefined;
      if (char.paramsNumber > 0) {
        /* current char has params, fetch them from chars */
        const { params, endPos } = this._generateParams(pos, chars);
        operatorParams = params;
        pos = endPos;
      }
      if (char instanceof OperandChar) {
        /* current char is an OperandChar, try to push it in the operand cache */
        if (!operandCache.push(char)) {
          /* push failed for the reason that the operand cache IS NOT empty, AND the char
          OR the first member of operand cache IS NOT a NumberChar object */
          /* push the operand cache into the infix expression and clear the cache */
          this._pushOperand(infixList, operandCache);
          operandCache = new OperandSymbol();

          /* push the OperandChar object into the operand cache */
          operandCache.push(char);
        }
        /* now operandCache has current char */
        if (operatorParams) {
          /* current char has params, set them to operandCache because it has current char */
          operandCache.params = operatorParams;
        }
      } else if (char instanceof OperatorChar) {
        /* the char is an OperatorChar, check the operand cache */
        if (operandCache.length > 0) {
          /* the operand cache is not empty, push it into infix expression and clear cache */
          this._pushOperand(infixList, operandCache);
          operandCache = new OperandSymbol();
        }

        /* create Operator object with current char (which is an OperatorChar object) and params */
        const operator = new OperatorSymbol(char, operatorParams);

        /* push the operator into the infix expression */
        this._pushOperator(infixList, operator);
      }

      pos += 1;
    }

    if (operandCache.length > 0) {
      /* operand cache IS NOT empty, push the operand cache into the infix expression if it is not empty */
      this._pushOperand(infixList, operandCache);
    } else {
      const char = chars[pos - 1];
      if (char instanceof OperatorChar && char.hasRightOperand) {
        /* the last member of infix expression is an OperatorChar object which HAS right operand,
          push a placeholder into the infix expression */
        this._pushOperand(
          infixList,
          new OperandSymbol(
            this._formula.charFactory.createPlaceholder(char, "right")
          )
        );
      }
    }

    return infixList;
  }

  private _generateParams(
    startPos: number,
    chars: MathChar[]
  ): { params: MathChar[][]; endPos: number } {
    let opLvl = 1,
      pos = startPos,
      param: MathChar[] = [];
    const params: MathChar[][] = [];
    while (pos < chars.length) {
      pos += 1;
      const item = chars[pos];

      if (item instanceof ParamSeparator && opLvl == 1) {
        /* current item is param separator ("|") and operator level is 1, so push param into params */
        if (param.length == 0) {
          /* param is empty, push a placeholder into it */
          param.push(this._formula.charFactory.createPlaceholder(item, "left"));
        }
        params.push(param);
        param = [];
        /* continue */
        continue;
      } else if (item instanceof ParamEnd) {
        /* current item is paran end ("]"), operator level -= 1 */
        opLvl -= 1;
        if (opLvl == 0) {
          /* operator level == 0 means all params of current operator have been pushed */
          if (param.length == 0) {
            /* param is empty, push a placeholder into it */
            param.push(
              this._formula.charFactory.createPlaceholder(item, "left")
            );
          }
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

  private _pushOperator(infixList: InfixList, operator: OperatorSymbol) {
    const prevItem = infixList[infixList.length - 1];
    if (!prevItem) {
      if (operator.hasLeftOperand) {
        /* the previous item DOES NOT exist, and the current operator HAS the left operand
        push a operand with "placeholder" into inputs */
        infixList.push(
          new OperandSymbol(
            this._formula.charFactory.createPlaceholder(operator.char, "left")
          )
        );
      }
    } else {
      if (prevItem instanceof OperandSymbol) {
        if (!operator.hasLeftOperand) {
          /* the previous item is an Operand object, and the current operator DOES NOT HAVE
          the left operand, push a "hidden" into inputs */
          infixList.push(
            new OperatorSymbol(this._formula.charFactory.createHiddenTimes())
          );
        }
      } else if (prevItem instanceof OperatorSymbol) {
        if (prevItem.hasRightOperand && operator.hasLeftOperand) {
          /* the previous item is an operator which has right operand, and the current operator
          has left operand, push a "placeholder" into inputs */
          infixList.push(
            new OperandSymbol(
              this._formula.charFactory.createPlaceholder(operator.char, "left")
            )
          );
        } else if (!prevItem.hasRightOperand && !operator.hasLeftOperand) {
          /* the previous item is an operator which DOES NOT HAVE right operand, and the
          current operator DOES NOT HAVE left operand, push a "hidden" into inputs */
          infixList.push(
            new OperatorSymbol(this._formula.charFactory.createHiddenTimes())
          );
        }
      }
    }

    infixList.push(operator);
  }

  private _pushOperand(infixList: InfixList, operand: OperandSymbol) {
    if (operand.length == 0) {
      return;
    }
    const prevItem = infixList[infixList.length - 1];
    if (
      prevItem instanceof OperandSymbol ||
      (prevItem instanceof OperatorSymbol && !prevItem.hasRightOperand)
    ) {
      /* previous item of inputs is an Operand object, or it is an Operator object and
      it HAS NOT the right operand, push a "hidden" operator into inputs */
      infixList.push(
        new OperatorSymbol(this._formula.charFactory.createHiddenTimes())
      );
    }
    infixList.push(operand);
  }
}
