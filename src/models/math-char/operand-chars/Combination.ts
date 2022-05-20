import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("combination")
@Latex.RenderChar(({ params, h }) => h("{_{<0>}C_{<1>}}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mrow", {
    children: [
      h("msub", { children: [h("mi"), h("mrow", [params[0]])] }),
      h("msub", { children: [h("mi", "C"), h("mrow", [params[1]])] }),
    ],
  }),
])
export default class Combination extends OperandChar {
  constructor() {
    super("combination");
    this._paramsNumber = 2;
  }
}
