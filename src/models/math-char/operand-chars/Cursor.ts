import Config from "../../Config";
import OperandChar from "../OperandChar";

export default class Cursor extends OperandChar {
  constructor() {
    super("cursor");
    this._latexTemplate = Config.getConfig().cursorLatex;
  }
}
