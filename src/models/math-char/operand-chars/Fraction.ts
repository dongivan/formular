import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("fraction", "frac")
@Latex.RenderChar(({ params, h }) => h("\\frac{<0>}{<1>}", params))
@MathML.RenderChar(({ params, h }) => [h("mfrac", params)])
export default class Fraction extends OperandChar {
  constructor() {
    super("frac");
    this._paramsNumber = 2;
  }
}
