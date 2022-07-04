import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("limit", "lim")
@Latex.RenderChar(({ params, h }) =>
  h("\\lim_{{<0>}\\rightarrow{<1>}}{<2>}", params)
)
@MathML.RenderChar(({ params, h }) => [
  h("mrow", [
    h("munder", [
      h(
        "mo",
        {
          movablelimits: "true",
        },
        "lim"
      ),
      h("mrow", [
        h("mrow", params[0]),
        h(
          "mo",
          {
            stretchy: "false",
          },
          "&#x2192;"
        ),
        h("mrow", params[1]),
      ]),
    ]),
    h("mrow", params[2]),
  ]),
])
@WolframAlpha.RenderChar(({ params, h }) => h("Limit[<2>,<0>-><1>", params))
export default class Limit extends OperandChar {
  protected _paramsNumber = 3;
  protected _paramsParen = 1 << 2;

  constructor() {
    super("limit");
  }
}
