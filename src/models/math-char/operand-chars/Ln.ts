import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("ln")
@Latex.RenderChar(({ params, h }) => h("\\ln{<0>}", params))
@MathML.RenderChar(({ params, h }) => [h("mi", "ln"), h("mrow", [params[0]])])
export default class Ln extends OperandChar {
  protected _clickable = true;
  protected _paramsNumber = 1;
  protected _paramsParen = 1;

  constructor() {
    super("ln");
  }
}
