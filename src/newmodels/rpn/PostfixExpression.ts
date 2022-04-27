import Operand from "./Operand";
import LeftParen from "../operator-symbols/LeftParen";
import RightParen from "../operator-symbols/RightParen";
import Operator from "./Operator";

export default class PostfixExpression {
  private _list: (Operand | Operator)[];

  constructor(infix: readonly (Operand | Operator)[]) {
    this._list = this._generatePostfixList(infix);
  }

  private _generatePostfixList(
    infix: readonly (Operand | Operator)[]
  ): (Operand | Operator)[] {
    /* use shunting yard algorithm to parse infix expression to postfix expression */
    const postfixList: (Operand | Operator)[] = [],
      operatorStack: Operator[] = [];

    let pos = 0;
    while (pos < infix.length) {
      let item = infix[pos];
      if (item instanceof Operand) {
        postfixList.push(item);
      } else if (item instanceof Operator) {
        if (item.hasParams) {
          const postfixedItem = new Operator(item.symbol),
            params: (Operator | Operand)[][] = [];
          for (const param of item.params) {
            params.push(this._generatePostfixList(param));
          }
          postfixedItem.params = params;
          item = postfixedItem;
        }
        if (item.symbol instanceof RightParen) {
          /* the current symbol is a ")", so push it into stack(top operators of the stack will pop to the output 
            list one by one until the stack is empty or the top one is a ")" ). */
          this._pushOperatorIntoStack(item, operatorStack, postfixList);
          /* now the top operator of the stack is ")", pop it to the output list. */
          postfixList.push(operatorStack[0]);
          operatorStack.shift();
          /* if the top operator (after pop ")") is "(", pop it to the output list. */
          const leftParen = operatorStack[0];
          if (leftParen?.symbol instanceof LeftParen) {
            postfixList.push(leftParen);
            operatorStack.shift();
          }
        } else {
          /* push the OperatorSymbol object into operator stack */
          this._pushOperatorIntoStack(item, operatorStack, postfixList);
        }
      }

      pos += 1;
    }

    /* push every operator of the operator stack into the output list */
    while (operatorStack.length > 0) {
      postfixList.push(operatorStack[0]);
      operatorStack.shift();
    }

    return postfixList;
  }

  private _pushOperatorIntoStack(
    operator: Operator,
    operatorStack: Operator[],
    postfixList: (Operand | Operator)[]
  ) {
    /* pop operators from the operator stack until the priority of the top operator is less than the operator's
     and push them into the output list */
    while (
      operatorStack.length > 0 &&
      !(operatorStack[0].symbol instanceof LeftParen) &&
      operatorStack[0].priority >= operator.priority
    ) {
      postfixList.push(operatorStack[0]);
      operatorStack.shift();
    }
    operatorStack.unshift(operator);
  }

  get RPNList(): readonly (Operand | Operator)[] {
    return Object.freeze(this._list);
  }
}
