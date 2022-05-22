import { Latex, MathML } from "../../renderer";
import { OperandChar } from "../internal";

@Latex.RenderChar(({ char, params }) => Latex.renderMathFunction(char, params))
@MathML.RenderChar(({ char, params }) =>
  MathML.renderMathFunction(char, params)
)
export default class MathFunction extends OperandChar {
  protected _interactive = true;
  protected _paramsNumber = 1;
  protected _paramsParen = 1;

  constructor(fnName: string) {
    super(fnName.slice(-2) == "()" ? fnName.slice(0, -2) : fnName);
  }
}
