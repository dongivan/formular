import type { DecimalSymbol } from "@/models/math-symbol";
import type MathMLNode from "@/models/MathMLNode";
import { Latex, MathML } from "../../Renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar(".", "point")
@Latex.RenderNode(({ node, renderChar }) => {
  const symbol = node.symbol as DecimalSymbol;
  return (
    symbol.integers.map<string>((char) => renderChar(char, [])).join("") +
    renderChar(symbol.char, []) +
    symbol.decimals.map<string>((char) => renderChar(char, [])).join("")
  );
})
@MathML.RenderChar(({ char, h }) => [h("mn", char.value)])
@MathML.RenderNode(({ node, renderChar }) => {
  const symbol = node.symbol as DecimalSymbol;
  return [
    ...symbol.integers.map<MathMLNode>((char) => {
      return renderChar(char, [])[0];
    }),
    ...renderChar(symbol.char, []),
    ...symbol.decimals.map<MathMLNode>((char) => {
      return renderChar(char, [])[0];
    }),
  ];
})
export default class DecimalPoint extends OperandChar {
  protected _clickable = true;

  constructor() {
    super(".");
  }
}
