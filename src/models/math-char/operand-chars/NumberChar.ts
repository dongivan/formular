import { LatexNumberRenderer, MMLNumberRenderer } from "../../renderer";
import OperandChar from "../OperandChar";

export default class NumberChar extends OperandChar {
  readonly latexRenderer = LatexNumberRenderer;
  readonly mmlRenderer = MMLNumberRenderer;
  protected _clickable = true;
  readonly mmlTag = "mn";

  constructor(value: number) {
    super(value.toString());
  }
}
