import SymbolContainer from "../SymbolContainer";
import InfixExpression from "./InfixExpression";
import PostfixExpression from "./PostfixExpression";

export default class RPNGenerator {
  private _infix: InfixExpression;

  constructor(container: SymbolContainer) {
    this._infix = new InfixExpression(container.symbols);
  }

  toPostfixExpression(): PostfixExpression {
    return new PostfixExpression(this._infix);
  }
}
