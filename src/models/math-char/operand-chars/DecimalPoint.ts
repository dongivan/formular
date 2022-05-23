import type { DecimalNode } from "../../math-node";
import type MathMLNode from "../../MathMLNode";
import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar(".", "point")
@Latex.RenderNode(({ node, renderChar }) => {
  const decimalNode = node as DecimalNode;
  return (
    decimalNode.integers.map<string>((char) => renderChar(char, [])).join("") +
    renderChar(decimalNode.char, []) +
    decimalNode.decimals.map<string>((char) => renderChar(char, [])).join("")
  );
})
@MathML.RenderChar(({ char, h }) => [h("mn", char.value)])
@MathML.RenderNode(({ node, renderChar }) => {
  const decimaoNode = node as DecimalNode;
  return [
    ...decimaoNode.integers.map<MathMLNode>((char) => {
      return renderChar(char, [])[0];
    }),
    ...renderChar(decimaoNode.char, []),
    ...decimaoNode.decimals.map<MathMLNode>((char) => {
      return renderChar(char, [])[0];
    }),
  ];
})
@WolframAlpha.RenderNode(({ node, renderChar }) => {
  const decimalNode = node as DecimalNode;
  return (
    decimalNode.integers.map<string>((char) => renderChar(char, [])).join("") +
    renderChar(decimalNode.char, []) +
    decimalNode.decimals.map<string>((char) => renderChar(char, [])).join("")
  );
})
export default class DecimalPoint extends OperandChar {
  protected _interactive = true;

  constructor() {
    super(".");
  }
}
