import Operand from "./Operand";
import LeftParen from "../operator-symbols/LeftParen";
import RightParen from "../operator-symbols/RightParen";
import Operator from "./Operator";
import SymbolGroup from "./SymbolGroup";
import InfixExpression from "./InfixExpression";

export default class PostfixExpression {
  private _list: SymbolGroup[];

  constructor(infix: InfixExpression) {
    this._list = this._generatePostfixList(infix.list);
  }

  private _generatePostfixList(infix: readonly SymbolGroup[]): SymbolGroup[] {
    /* use shunting yard algorithm to parse infix expression to postfix expression */
    const postfixList: SymbolGroup[] = [],
      operatorStack: Operator[] = [];

    let pos = 0;
    while (pos < infix.length) {
      const item = infix[pos];
      if (item instanceof Operand) {
        postfixList.push(item);
      } else if (item instanceof Operator) {
        /* directly use `item` which is an Operator object here will cause prettier error */
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
    postfixList: SymbolGroup[]
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

  get list(): readonly SymbolGroup[] {
    return Object.freeze(this._list);
  }

  toString(): string {
    return (
      "[" +
      this._list.map<string>((symbol) => symbol.toString()).join(", ") +
      "]"
    );
  }
}
