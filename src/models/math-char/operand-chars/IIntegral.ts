import { Latex, MathML } from "../../Renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.registerMathChar("i-integral")
@Latex.RenderChar(({ params, h }) => h("\\int{<0>}d{<1>}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mo", "&#x222B;"),
  h("mrow", [params[0]]),
  h("mi", "d"),
  h("mrow", [params[1]]),
])
export default class IIntegral extends OperandChar {
  protected _paramsNumber = 2;

  constructor() {
    super("i-integral");
  }
}
