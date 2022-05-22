import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("prod", "product")
@Latex.RenderChar(({ params, h }) =>
  h("\\prod^{<2>}_{{<0>}={<1>}}{<3>}", params)
)
@MathML.RenderChar(({ params, h }) => [
  h("mrow", {
    children: [
      h("munderover", {
        children: [
          h("mo", "&#x220F;"),
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
    ],
  }),
])
export default class Product extends OperandChar {
  protected _paramsNumber = 4;
  protected _paramsParen = 1 << 3;

  constructor() {
    super("prod");
  }
}
