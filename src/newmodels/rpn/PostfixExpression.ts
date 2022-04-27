import Operand from "./Operand";
import OperatorSymbol from "../OperatorSymbol";
import InfixExpression from "./InfixExpression";
import LeftParen from "../operator-symbols/LeftParen";
import RightParen from "../operator-symbols/RightParen";

export default class PostfixExpression {
  private _list: (Operand | OperatorSymbol)[] = [];

  constructor(infix: InfixExpression) {
    /* use shunting yard algorithm to parse infix expression to postfix expression */
    const operatorStack: OperatorSymbol[] = [];

    let pos = 0;
    while (pos < infix.length) {
      const item = infix.get(pos);
      if (item instanceof Operand) {
        this._list.push(item);
      } else if (item instanceof OperatorSymbol) {
        if (item instanceof RightParen) {
          /* the current symbol is a ")", so push it into stack(top operators of the stack will pop to the output 
            list one by one until the stack is empty or the top one is a ")" ). */
          this._pushOperatorIntoStack(item, operatorStack);
          /* now the top operator of the stack is ")", pop it to the output list. */
          this._list.push(operatorStack[0]);
          operatorStack.shift();
          /* if the top operator (after pop ")") is "(", pop it to the output list. */
          const leftParen = operatorStack[0];
          if (leftParen instanceof LeftParen) {
            this._list.push(leftParen);
            operatorStack.shift();
          }
        } else {
          /* push the OperatorSymbol object into operator stack */
          this._pushOperatorIntoStack(item, operatorStack);
        }
      }

      pos += 1;
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
      !(operatorStack[0] instanceof LeftParen) &&
      operatorStack[0].priority >= operator.priority
    ) {
      this._list.push(operatorStack[0]);
      operatorStack.shift();
    }
    operatorStack.unshift(operator);
  }

  get RPNList(): readonly (Operand | OperatorSymbol)[] {
    return Object.freeze(this._list);
  }
}
