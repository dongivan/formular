import { LatexNumberRenderer } from "../../renderer";
import OperandChar from "../OperandChar";

export default class NumberChar extends OperandChar {
  readonly latexRenderer: typeof LatexNumberRenderer = LatexNumberRenderer;
  protected _clickable = true;

  constructor(value: number) {
    super(value.toString());
  }
}
