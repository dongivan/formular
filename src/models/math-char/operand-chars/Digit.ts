import type { IntegerSymbol } from "@/models/math-symbol";
import type MathMLNode from "@/models/MathMLNode";
import { Latex, MathML } from "../../Renderer";
import { OperandChar } from "../internal";

@Latex.RenderNode(({ node, renderChar }) => {
  return (node.symbol as IntegerSymbol).integers
    .map<string>((char) => renderChar(char, []))
    .join("");
})
@MathML.RenderChar(({ char, h }) => [h("mn", char.value)])
@MathML.RenderNode(({ node, renderChar }) => {
  const symbol = node.symbol as IntegerSymbol;
  return symbol.integers.map<MathMLNode>((char) => {
    return renderChar(char, [])[0];
  });
})
export default class Digit extends OperandChar {
  protected _clickable = true;

  constructor(value: string) {
    super(value.toString());
  }
}
