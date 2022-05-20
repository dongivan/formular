import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("limit", "lim")
@Latex.RenderChar(({ params, h }) =>
  h("\\lim_{{<0>}\\rightarrow{<1>}}{<2>}", params)
)
@MathML.RenderChar(({ params, h }) => [
  h("munder", {
    children: [
      h("mo", {
        value: "lim",
        attrs: { movablelimits: "true" },
      }),
      h("mrow", {
        children: [
          h("mrow", [params[0]]),
          h("mo", {
            value: "&#x2192;",
            attrs: { stretchy: "false" },
          }),
          h("mrow", [params[1]]),
        ],
      }),
    ],
  }),
  h("mrow", [params[2]]),
])
export default class Limit extends OperandChar {
  protected _paramsNumber = 3;
  protected _paramsParen = 1 << 2;

  constructor() {
    super("limit");
  }
}
