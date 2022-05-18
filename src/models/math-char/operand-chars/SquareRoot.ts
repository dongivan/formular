import { Latex, MathML } from "../../Renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("sqrt", "square-root")
@Latex.RenderChar(({ params, h }) => h("\\sqrt{<0>}", params))
@MathML.RenderChar(({ params, h }) => [h("msqrt", params)])
export default class SquareRoot extends OperandChar {
  constructor() {
    super("sqrt");
    this._paramsNumber = 1;
  }
}
