import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("combination")
@Latex.RenderChar(({ params, h }) => h("{_{<0>}C_{<1>}}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mrow", [
    h("msub", [h("mi"), h("mrow", params[0])]),
    h("msub", [h("mi", "C"), h("mrow", params[1])]),
  ]),
])
@WolframAlpha.RenderChar(({ params, h }) => h("Combination[<0>,<1>]", params))
export default class Combination extends OperandChar {
  constructor() {
    super("combination");
    this._paramsNumber = 2;
  }
}
