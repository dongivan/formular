import { Latex, MathML, WolframAlpha } from "../../renderer";
import { OperandChar } from "../internal";

@Latex.RenderChar(({ char }) => Latex.renderVariable(char))
@MathML.RenderChar(({ char }) => MathML.renderVariable(char))
@WolframAlpha.RenderChar(({ char }) => WolframAlpha.renderVariable(char))
export default class Variable extends OperandChar {
  protected _interactive = true;

  constructor(value: string) {
    super(value);
  }
}
