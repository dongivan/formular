import { LatexNumberRenderer } from "../../renderer";
import OperandChar from "../OperandChar";

export default class DecimalPoint extends OperandChar {
  readonly latexRenderer: typeof LatexNumberRenderer = LatexNumberRenderer;
  protected _clickable = true;

  constructor() {
    super(".");
  }
}
