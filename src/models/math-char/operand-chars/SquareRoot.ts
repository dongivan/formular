import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("sqrt", "square-root")
@Latex.RenderChar(({ params, h }) => h("\\sqrt{<0>}", params))
@MathML.RenderChar(({ params, h }) => [h("msqrt", [h("mrow", params[0])])])
@WolframAlpha.RenderChar(({ params, h }) => h("Sqrt[<0>]", params))
export default class SquareRoot extends OperandChar {
  constructor() {
    super("sqrt");
    this._paramsNumber = 1;
  }
}
