import type { IntegerNode } from "../../math-node";
import type MathMLNode from "../../MathMLNode";
import { Latex, MathML, WolframAlpha } from "../../renderer";
import { OperandChar } from "../internal";

@Latex.RenderNode(({ node, renderChar }) => {
  return (node as IntegerNode).integers
    .map<string>((char) => renderChar(char, []))
    .join("");
})
@MathML.RenderChar(({ char, h }) => [h("mn", char.value)])
@MathML.RenderNode(({ node, renderChar }) => {
  const integerNode = node as IntegerNode;
  return integerNode.integers.map<MathMLNode>((char) => {
    return renderChar(char, [])[0];
  });
})
@WolframAlpha.RenderNode(({ node, renderChar }) => {
  return (node as IntegerNode).integers
    .map<string>((char) => renderChar(char, []))
    .join("");
})
export default class Digit extends OperandChar {
  protected _interactive = true;

  constructor(value: string) {
    super(value.toString());
  }
}
