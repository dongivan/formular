import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("i-integral")
@Latex.RenderChar(({ params, h }) => h("\\int{<0>}d{<1>}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mrow", {
    children: [
      h("mo", "&#x222B;"),
      h("mrow", [params[0]]),
      h("mi", "d"),
      h("mrow", [params[1]]),
    ],
  }),
])
@WolframAlpha.RenderChar(({ params, h }) => h("Integrate[<0>,<1>]", params))
export default class IIntegral extends OperandChar {
  protected _paramsNumber = 2;

  constructor() {
    super("i-integral");
  }
}
