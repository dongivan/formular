import { replace } from "../../utils";
import Config from "../../Config";
import OperandChar from "../OperandChar";

export default class Cursor extends OperandChar {
  readonly mmlTag = "mrow";
  readonly mmlAttrs = {
    class: "formula-cursor",
  };

  constructor() {
    super("cursor");
    this._latexTemplate = replace(
      Config.getConfig().cursorLatex || "",
      Config.getConfig().cursorCssClass || ""
    );
    this._mmlValueTemplate = Config.getConfig().cursorMML;
    this.mmlAttrs.class = Config.getConfig().cursorCssClass || "";
  }
}
