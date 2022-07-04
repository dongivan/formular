import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("permutation")
@Latex.RenderChar(({ params, h }) => h("{_{<0>}P_{<1>}}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mrow", [
    h("msub", [h("mi"), h("mrow", params[0])]),
    h("msub", [h("mi", "P"), h("mrow", params[1])]),
  ]),
])
@WolframAlpha.RenderChar(({ params, h }) => h("Permutation[<0>,<1>]", params))
export default class Permutation extends OperandChar {
  constructor() {
    super("permutation");
    this._paramsNumber = 2;
  }
}
