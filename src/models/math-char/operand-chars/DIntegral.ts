import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("d-integral")
@Latex.RenderChar(({ params, h }) => h("\\int^<1>_<0>{<2>}d{<3>}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mrow", {
    children: [
      h("msubsup", {
        children: [
          h("mo", "&#x222B;"),
          h("mrow", { children: params[0] }),
          h("mrow", { children: params[1] }),
        ],
      }),
      h("mrow", { children: params[2] }),
      h("mi", "d"),
      h("mrow", { children: params[3] }),
    ],
  }),
])
export default class DIntegral extends OperandChar {
  protected _paramsNumber = 4;

  constructor() {
    super("i-integral");
  }
}