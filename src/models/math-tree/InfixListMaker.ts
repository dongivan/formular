import type { MathChar } from "../math-char";
import {
  ParamSeparator,
  ParamEnd,
  Digit,
  DecimalPoint,
  OperatorChar,
  OperandChar,
  Minus,
} from "../math-char";
import {
  OperandNode,
  OperatorNode,
  IntegerNode,
  DecimalNode,
} from "../math-node";
import type { MathNode } from "../math-node";
import Formula from "../Formula";
import { Instance } from "../InstanceResolver";

export default class InfixListMaker extends Instance {
  get formula(): Formula {
    return this.getTrackedRelated(Formula);
  }

  make(chars: MathChar[], reuse?: MathNode[]): MathNode[] {
    return this._generateInfixList(chars, reuse);
  }

  private _generateInfixList(
    chars: MathChar[],
    reuse?: MathNode[]
  ): MathNode[] {
    const infixList: MathNode[] = [];

    let pos = 0;
    while (pos < chars.length) {
      const char = chars[pos];
      let charParams: MathChar[][];
      if (char.paramsNumber > 0) {
        /* current char has params, fetch them from chars */
        const { params, endPos } = this._generateParams(chars, pos + 1);
        charParams = params;
        pos = endPos;
      } else {
        charParams = [];
      }

      if (char instanceof Digit || char instanceof DecimalPoint) {
        /* current char is a Digit, generate a NumberNode and push it into infix expression */
        const { integers, decimals, decimalPoint, endPos } =
          this._generateDigits(char, chars, pos + 1);
        const node = decimalPoint
          ? DecimalNode.create(
              {
                integers,
                char: decimalPoint,
                decimals,
              },
              reuse
            )
          : IntegerNode.create(
              {
                char: integers[0],
                integers,
              },
              reuse
            );
        this._pushOperand(infixList, node, reuse);
        pos = endPos;
      } else if (char instanceof OperandChar) {
        /* current char is an OperandChar (and IS NOT a Digit), push it */
        const node = OperandNode.create(
          {
            char,
            params: charParams,
          },
          reuse
        );
        this._pushOperand(infixList, node, reuse);
      } else if (char instanceof OperatorChar) {
        /* current char is an OperatorChar, push it */
        if (char instanceof Minus) {
          /* current char is a Minus, reset its priority & hasLeftOperand by previous char */
          char.adapt(chars[pos - 1]);
        }
        const node = OperatorNode.create(
          {
            char,
            params: charParams,
          },
          reuse
        );
        this._pushOperator(infixList, node, reuse);
      }

      pos += 1;
    }

    const char = chars[pos - 1];
    if (char instanceof OperatorChar && char.hasRightOperand) {
      /* the last member of infix expression is an OperatorChar object which HAS right operand,
        push a placeholder into the infix expression */
      this._pushOperand(
        infixList,
        OperandNode.create(
          {
            char: this.formula.charFactory.createPlaceholder(char, "right"),
          },
          reuse
        ),
        reuse
      );
    }

    return infixList;
  }

  private _generateParams(
    chars: MathChar[],
    startPos: number
  ): { params: MathChar[][]; endPos: number } {
    let opLvl = 1,
      pos = startPos,
      param: MathChar[] = [];
    const params: MathChar[][] = [];
    while (pos < chars.length) {
      const item = chars[pos];

      if (item instanceof ParamSeparator && opLvl == 1) {
        /* current item is param separator ("|") and operator level is 1, so push param into params */
        if (param.length == 0) {
          /* param is empty, push a placeholder into it */
          param.push(this.formula.charFactory.createPlaceholder(item, "left"));
        }
        params.push(param);
        param = [];
        /* continue */
        pos += 1;
        continue;
      } else if (item instanceof ParamEnd) {
        /* current item is paran end ("]"), operator level -= 1 */
        opLvl -= 1;
        if (opLvl == 0) {
          /* operator level == 0 means all params of current operator have been pushed */
          if (param.length == 0) {
            /* param is empty, push a placeholder into it */
            param.push(
              this.formula.charFactory.createPlaceholder(item, "left")
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
      pos += 1;
      param.push(item);
    }
    return { params, endPos: pos };
  }

  private _generateDigits(
    lead: Digit | DecimalPoint,
    chars: MathChar[],
    startPos: number
  ): {
    integers: Digit[];
    decimals: Digit[];
    decimalPoint: DecimalPoint | undefined;
    endPos: number;
  } {
    const integers: Digit[] = [];
    const decimals: Digit[] = [];
    let decimalPoint: DecimalPoint | undefined = undefined;

    if (lead instanceof DecimalPoint) {
      decimalPoint = lead;
    } else {
      integers.push(lead);
    }

    let pos = startPos;
    while (pos < chars.length) {
      const item = chars[pos];
      if (decimalPoint) {
        if (item instanceof Digit) {
          decimals.push(item);
        } else {
          pos -= 1;
          break;
        }
      } else {
        if (item instanceof Digit) {
          integers.push(item);
        } else if (item instanceof DecimalPoint) {
          decimalPoint = item;
        } else {
          pos -= 1;
          break;
        }
      }

      pos += 1;
    }

    return { integers, decimals, decimalPoint, endPos: pos };
  }

  private _pushOperator(
    infixList: MathNode[],
    operator: OperatorNode,
    reuse?: MathNode[]
  ) {
    const prevItem = infixList[infixList.length - 1];
    if (!prevItem) {
      if (operator.hasLeftOperand) {
        /* the previous item DOES NOT exist, and the current operator HAS the left operand
        push a operand with "placeholder" into inputs */
        infixList.push(
          OperandNode.create(
            {
              char: this.formula.charFactory.createPlaceholder(
                operator.char,
                "left"
              ),
            },
            reuse
          )
        );
      }
    } else {
      if (prevItem instanceof OperandNode) {
        if (!operator.hasLeftOperand) {
          /* the previous item is an Operand object, and the current operator DOES NOT HAVE
          the left operand, push a "hidden" into inputs */
          infixList.push(
            OperatorNode.create(
              {
                char: this.formula.charFactory.createHiddenTimes(),
              },
              reuse
            )
          );
        }
      } else if (prevItem instanceof OperatorNode) {
        if (prevItem.hasRightOperand && operator.hasLeftOperand) {
          /* the previous item is an operator which has right operand, and the current operator
          has left operand, push a "placeholder" into inputs */
          infixList.push(
            OperandNode.create(
              {
                char: this.formula.charFactory.createPlaceholder(
                  operator.char,
                  "left"
                ),
              },
              reuse
            )
          );
        } else if (!prevItem.hasRightOperand && !operator.hasLeftOperand) {
          /* the previous item is an operator which DOES NOT HAVE right operand, and the
          current operator DOES NOT HAVE left operand, push a "hidden" into inputs */
          infixList.push(
            OperatorNode.create(
              {
                char: this.formula.charFactory.createHiddenTimes(),
              },
              reuse
            )
          );
        }
      }
    }

    infixList.push(operator);
  }

  private _pushOperand(
    infixList: MathNode[],
    operand: OperandNode,
    reuse?: MathNode[]
  ) {
    const prevItem = infixList[infixList.length - 1];
    if (
      prevItem instanceof OperandNode ||
      (prevItem instanceof OperatorNode && !prevItem.hasRightOperand)
    ) {
      /* previous item of inputs is an Operand object, or it is an Operator object and
      it HAS NOT the right operand, push a "hidden" operator into inputs */
      infixList.push(
        OperatorNode.create(
          {
            char: this.formula.charFactory.createHiddenTimes(),
          },
          reuse
        )
      );
    }
    infixList.push(operand);
  }
}
