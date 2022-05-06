import Config from "../../Config";
import { replace } from "../../utils";
import LatexCharRenderer from "../mathjax-latex/CharRenderer";

const clickableTemplate = "\\htmlData{<0>=<1>}{<2>}";
const cursorTemplate = replace(
  Config.getConfig().cursorLatex || "",
  Config.getConfig().cursorCssClass || ""
);
const placeholderTemplate = replace(
  Config.getConfig().placeholderLatex || "",
  Config.getConfig().placeholderCssClass || ""
);

export default class CharRenderer extends LatexCharRenderer {
  protected _templates = {
    ...super._templates,
    Cursor: cursorTemplate,
    PlaceHolder: placeholderTemplate,
  };

  protected addClickableMark(latex: string, sn: number): string {
    return replace(clickableTemplate, [
      Config.getConfig().clickableDataKey || "",
      sn.toString(),
      latex,
    ]);
  }
}
