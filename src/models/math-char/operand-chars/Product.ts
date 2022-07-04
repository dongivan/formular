import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("prod", "product")
@Latex.RenderChar(({ params, h }) =>
  h("\\prod^{<2>}_{{<0>}={<1>}}{<3>}", params)
)
@MathML.RenderChar(({ params, h }) => [
  h("mrow", [
    h("munderover", [
      h("mo", "&#x220F;"),
      h("mrow", [h("mrow", params[0]), h("mo", "="), h("mrow", params[1])]),
      h("mrow", params[2]),
    ]),
    h("mrow", params[3]),
  ]),
])
@WolframAlpha.RenderChar(({ params, h }) =>
  h("Product[<3>,{<0>,<1>,<2>}]", params)
)
export default class Product extends OperandChar {
  protected _paramsNumber = 4;
  protected _paramsParen = 1 << 3;

  constructor() {
    super("prod");
  }
}
