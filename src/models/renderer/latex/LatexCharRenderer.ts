import { Cursor, MathChar, Placeholder } from "../../math-char";
import { replace } from "../../utils";
import CharRenderer from "../CharRenderer";

type TemplateFunction = () => string;

const parenPrefixes = ["", "\\big", "\\Big", "\\bigg", "\\Bigg"];

export default class LatexCharRenderer extends CharRenderer<string> {
  protected _templates: Record<string, string | TemplateFunction> = {
    MathChar: "<0>",
    Cursor: "⬚",
    Placeholder: "⍰",
    Fraction: "\\frac{<1>}{<2>}",
    SquareRoot: "\\sqrt{<1>}",
    HiddenTimes: "",
    Power: "^{<1>}",
  };

  protected _findTemplates(char: MathChar): string {
    let cls = char.constructor;
    do {
      const template: string | TemplateFunction = this._templates[cls.name];
      if (template !== undefined) {
        if (typeof template == "function") {
          return template();
        } else {
          return template;
        }
      }
      cls = Object.getPrototypeOf(cls);
    } while (cls.name !== "");
    return "";
  }

  protected _render(char: MathChar, params: string[]): string {
    let template;
    if (
      !this._interactive &&
      (char instanceof Cursor || char instanceof Placeholder)
    ) {
      template = "";
    } else {
      template = this._findTemplates(char);
    }
    return replace(template, [char.value, ...params]);
  }

  protected _setParenthesesLevel(latex: string, level: number) {
    return (parenPrefixes[Math.min(Math.max(level, 0), 4)] || "") + latex;
  }
}
