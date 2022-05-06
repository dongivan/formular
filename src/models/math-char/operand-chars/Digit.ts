import { LatexNumberRenderer, MathMLNumberRenderer } from "../../renderer";
import OperandChar from "../OperandChar";

export default class Digit extends OperandChar {
  readonly latexRenderer = LatexNumberRenderer;
  readonly mathMLRenderer = MathMLNumberRenderer;
  protected _clickable = true;

  constructor(value: number) {
    super(value.toString());
  }
}
