import { IIntegral } from "../../../math-char";
import { OperandSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: OperandSymbol<IIntegral>,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const parameters = symbol.params.map<MathMLNode>((param, i) => {
      const infix = renderer.formula.infixMaker.make(param);
      const postfix = renderer.formula.postfixMaker.make(infix);
      const tree = renderer.formula.binaryTreeMaker.make(
        postfix,
        symbol.char.hasParamParen(i)
      );
      return new MathMLNode("mrow", { children: tree.renderMathML().children });
    });
    return [
      renderer.charRenderer.render(symbol.char),
      parameters[0],
      new MathMLNode("mi", { value: "d" }),
      parameters[1],
    ];
  },
} as SymbolRendererFunction<MathMLNode[]>;
