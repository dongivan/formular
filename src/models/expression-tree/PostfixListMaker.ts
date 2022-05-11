import { OperandSymbol, OperatorSymbol } from "../math-symbol";
import { LeftParen, RightParen } from "../math-char";
import type Formula from "../Formula";
import type InfixList from "./InfixList";
import type PostfixList from "./PostfixList";

export default class PostfixListMaker {
  private _formula: Formula;

  constructor(formula: Formula) {
    this._formula = formula;
  }

  make(infix: InfixList): PostfixList {
    return this._generatePostfixList(infix);
  }

  private _generatePostfixList(infix: InfixList): PostfixList {
    /* use shunting yard algorithm to parse infix expression to postfix expression */
    const postfixList: PostfixList = [],
      operatorStack: OperatorSymbol[] = [];

    let pos = 0;
    while (pos < infix.length) {
      const item = infix[pos];
      if (item instanceof OperandSymbol) {
        postfixList.push(item);
      } else if (item instanceof OperatorSymbol) {
        /* directly use `item` which is an Operator object here will cause prettier error */
        if (item.char instanceof RightParen) {
          /* the current char is a ")", so push it into stack(top operators of the stack will pop to the output 
            list one by one until the stack is empty or the top one is a ")" ). */
          this._pushOperatorIntoStack(item, operatorStack, postfixList);
          /* now the top operator of the stack is ")", pop it to the output list. */
          postfixList.push(operatorStack[0]);
          operatorStack.shift();
          /* if the top operator (after pop ")") is "(", pop it to the output list. */
          const leftParen = operatorStack[0];
          if (leftParen?.char instanceof LeftParen) {
            postfixList.push(leftParen);
            operatorStack.shift();
          }
        } else {
          /* push the OperatorChar object into operator stack */
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
    operator: OperatorSymbol,
    operatorStack: OperatorSymbol[],
    postfixList: PostfixList
  ) {
    /* pop operators from the operator stack until the priority of the top operator is less than the operator's
     and push them into the output list */
    while (
      operatorStack.length > 0 &&
      !(operatorStack[0].char instanceof LeftParen) &&
      operatorStack[0].priority >= operator.priority
    ) {
      postfixList.push(operatorStack[0]);
      operatorStack.shift();
    }
    operatorStack.unshift(operator);
  }
}
