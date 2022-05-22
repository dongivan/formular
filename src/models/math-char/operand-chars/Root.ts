import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("root")
@Latex.RenderChar(({ params, h }) => h("\\sqrt[<1>]{<0>}", params))
@MathML.RenderChar(({ params, h }) => [h("mroot", params)])
export default class Root extends OperandChar {
  constructor() {
    super("root");
    this._paramsNumber = 2;
  }
}
