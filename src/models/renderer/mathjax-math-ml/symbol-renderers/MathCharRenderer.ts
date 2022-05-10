import { MathChar } from "../../../math-char";
import { MathSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: MathSymbol<MathChar>,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const children = symbol.params.map<MathMLNode>((param) => {
      const infix = renderer.formula.infixMaker.make(param);
      const postfix = renderer.formula.postfixMaker.make(infix);
      const tree = renderer.formula.binaryTreeMaker.make(postfix);
      return new MathMLNode("mrow", { children: tree.renderMathML().children });
    });
    return [renderer.charRenderer.render(symbol.char, children)];
  },
  operatorRenderer: (
    symbol: MathSymbol<MathChar>,
    leftOperand: MathMLNode[] | undefined,
    rightOperand: MathMLNode[] | undefined,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const result: MathMLNode[] = [];
    result.push(...(leftOperand || []));
    result.push(...renderer.renderOperand(symbol));
    result.push(...(rightOperand || []));
    return result;
  },
} as SymbolRendererFunction<MathMLNode[]>;
