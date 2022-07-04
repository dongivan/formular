import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("differential", "dif")
@Latex.RenderChar(({ params, h }) => h("\\frac{d{<0>}}{d{<1>}}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mfrac", [
    h("mrow", [h("mi", "d"), h("mrow", params[0])]),
    h("mrow", [h("mi", "d"), h("mrow", params[1])]),
  ]),
])
@WolframAlpha.RenderChar(({ params, h }) => h("D[<0>,<1>]", params))
export default class Differential extends OperandChar {
  constructor() {
    super("dif");
    this._paramsNumber = 2;
  }
}
