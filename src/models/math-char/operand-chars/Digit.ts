import { LatexNumberRenderer, MMLNumberRenderer } from "../../renderer";
import OperandChar from "../OperandChar";

export default class Digit extends OperandChar {
  readonly latexRenderer = LatexNumberRenderer;
  readonly mmlRenderer = MMLNumberRenderer;
  protected _clickable = true;

  constructor(value: number) {
    super(value.toString());
  }
}
