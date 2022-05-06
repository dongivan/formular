import { LatexNumberRenderer, MathMLNumberRenderer } from "../../renderer";
import OperandChar from "../OperandChar";

export default class DecimalPoint extends OperandChar {
  readonly latexRenderer = LatexNumberRenderer;
  readonly mathMLRenderer = MathMLNumberRenderer;
  protected _clickable = true;

  constructor() {
    super(".");
  }
}
