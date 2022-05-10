import { Sum } from "../../../math-char";
import { OperandSymbol } from "../../../math-symbol";
import MathMLNode from "../../../MathMLNode";
import { SymbolRendererFunction } from "../../SymbolRendererTypes";
import SymbolRenderer from "../SymbolRenderer";

export default {
  operandRenderer: (
    symbol: OperandSymbol<Sum>,
    renderer: SymbolRenderer
  ): MathMLNode[] => {
    const parameters = symbol.params.map<MathMLNode>((param, i) => {
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
    const underRow = new MathMLNode("mrow");
    const equal = new MathMLNode("mo");
    equal.value = "=";
    underRow.children.push(parameters[0], equal, parameters[1]);
    const sigma = new MathMLNode("munderover");
    sigma.children.push(
      renderer.charRenderer.render(symbol.char),
      underRow,
      parameters[2]
    );
    return [sigma, parameters[3]];
  },
} as SymbolRendererFunction<MathMLNode[]>;
