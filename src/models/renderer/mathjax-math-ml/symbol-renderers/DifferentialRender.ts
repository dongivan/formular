import { Differential } from "../../../math-char";
import { OperandSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: OperandSymbol<Differential>,
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
      new MathMLNode("mfrac", {
        children: [
          new MathMLNode("mrow", {
            children: [new MathMLNode("mi", { value: "d" }), parameters[0]],
          }),
          new MathMLNode("mrow", {
            children: [new MathMLNode("mi", { value: "d" }), parameters[1]],
          }),
        ],
      }),
    ];
  },
} as SymbolRendererFunction<MathMLNode[]>;
