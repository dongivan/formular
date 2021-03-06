import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("d-integral", "defint")
@Latex.RenderChar(({ params, h }) => h("\\int^{<1>}_{<0>}{<2>}d{<3>}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mrow", [
    h("msubsup", [
      h("mo", "&#x222B;"),
      h("mrow", params[0]),
      h("mrow", params[1]),
    ]),
    h("mrow", params[2]),
    h("mi", "d"),
    h("mrow", params[3]),
  ]),
])
@WolframAlpha.RenderChar(({ params, h }) =>
  h("Integrate[<2>,{<3>,<0>,<1>}]", params)
)
export default class DIntegral extends OperandChar {
  protected _paramsNumber = 4;

  constructor() {
    super("d-integral");
  }
}
