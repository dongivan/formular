import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("permutation")
@Latex.RenderChar(({ params, h }) => h("{_{<0>}P_{<1>}}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mrow", {
    children: [
      h("msub", { children: [h("mi"), h("mrow", [params[0]])] }),
      h("msub", { children: [h("mi", "P"), h("mrow", [params[1]])] }),
    ],
  }),
])
export default class Permutation extends OperandChar {
  constructor() {
    super("permutation");
    this._paramsNumber = 2;
  }
}
