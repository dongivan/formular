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
    const children = symbol.params.map<MathMLNode>((param, i) => {
      const row = new MathMLNode("mrow");
      const infix = renderer.formula.infixMaker.make(param);
      const postfix = renderer.formula.postfixMaker.make(infix);
      const tree = renderer.formula.binaryTreeMaker.make(
        postfix,
        symbol.char.hasParamParen(i)
      );
      row.children = tree.renderMathML().children;
      return row;
    });
    return [renderer.charRenderer.render(symbol.char), ...children];
  },
} as SymbolRendererFunction<MathMLNode[]>;
