import Config from "../../Config";
import { replace } from "../../utils";
import LatexCharRenderer from "./LatexCharRenderer";

const clickableTemplate = "\\htmlData{<0>=<1>}{<2>}";

export default class KatexCharRenderer extends LatexCharRenderer {
  protected _templates: Record<string, string | (() => string)> = {
    ...super._templates,
    Cursor: () =>
      replace(
        Config.getConfig().cursorLatex || "",
        Config.getConfig().cursorCssClass || ""
      ),
    PlaceHolder: () =>
      replace(
        Config.getConfig().placeholderLatex || "",
        Config.getConfig().placeholderCssClass || ""
      ),
  };

  protected addClickableMark(latex: string, sn: number): string {
    return replace(clickableTemplate, [
      Config.getConfig().clickableDataKey || "",
      sn.toString(),
      latex,
    ]);
  }
}
