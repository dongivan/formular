import { Latex, MathML } from "../../Renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("sum")
@Latex.RenderChar(({ params, h }) =>
  h("\\sum^{<2>}_{{<0>}={<1>}}{<3>}", params)
)
@MathML.RenderChar(({ params, h }) => [
  h("munderover", {
    children: [
      h("mo", "&#x2211;"),
      h("mrow", {
        children: [
          h("mrow", [params[0]]),
          h("mo", "="),
          h("mrow", [params[1]]),
        ],
      }),
      h("mrow", [params[2]]),
    ],
  }),
  h("mrow", [params[3]]),
])
export default class Sum extends OperandChar {
  protected _paramsNumber = 4;
  protected _paramsParen = 1 << 3;

  constructor() {
    super("sum");
  }
}
