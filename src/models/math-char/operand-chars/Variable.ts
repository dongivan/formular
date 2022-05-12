import { Latex, MathML } from "../../Renderer";
import { OperandChar } from "../internal";

@Latex.RenderChar(({ char }) => Latex.renderVariable(char))
@MathML.RenderChar(({ char }) => MathML.renderVariable(char))
export default class Variable extends OperandChar {
  protected _clickable = true;

  constructor(value: string) {
    super(value);
  }
}
