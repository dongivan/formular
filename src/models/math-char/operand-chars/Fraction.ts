import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("fraction", "frac")
@Latex.RenderChar(({ params, h }) => h("\\frac{<0>}{<1>}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mfrac", [h("mrow", params[0]), h("mrow", params[1])]),
])
@WolframAlpha.RenderChar(({ params, h }) => h("Divide[<0>,<1>]", params))
export default class Fraction extends OperandChar {
  constructor() {
    super("frac");
    this._paramsNumber = 2;
  }
}
