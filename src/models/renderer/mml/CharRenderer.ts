import Config from "@/models/Config";
import MathMLNode from "@/models/MathMLNode";
import { Cursor, MathChar, Placeholder } from "../../math-char";
import BaseRenderer from "../CharRenderer";

type TemplateParam = {
  tag: string;
  value?: string;
  attrs?: Record<string, string | undefined>;
};

const parenAttrs = [
  { stretchy: "false" },
  { stretchy: "true", minsize: "1.2em", maxsize: "1.2em" },
  { stretchy: "true", minsize: "1.623em", maxsize: "1.623em" },
  { stretchy: "true", minsize: "2.047em", maxsize: "2.047em" },
  { stretchy: "true", minsize: "2.470em", maxsize: "2.470em" },
];

export default class CharRenderer extends BaseRenderer<MathMLNode> {
  protected _templates: Record<string, TemplateParam> = {
    MathChar: { tag: "mtext" },
    Cursor: {
      tag: "mrow",
      value: Config.getConfig().cursorMML,
      attrs: { class: Config.getConfig().cursorCssClass },
    },
    Placeholder: {
      tag: "mrow",
      value: Config.getConfig().placeholderMML,
      attrs: { class: Config.getConfig().placeholderCssClass },
    },
    DecimalPoint: { tag: "mn" },
    Digit: { tag: "mn" },
    Fraction: { tag: "mfrac" },
    SquareRoot: { tag: "msqrt" },
    Variable: { tag: "mi" },
    OperandChar: { tag: "mi" },
    OperatorChar: { tag: "mo" },
    Divide: { tag: "mo", value: "&#xF7;" },
    Minus: { tag: "mo", value: "&#x2212;" },
    HiddenTimes: { tag: "mtext", value: "" },
    Power: { tag: "msup" },
    Times: { tag: "mo", value: "&#xD7;" },
  };

  protected _findTemplates(char: MathChar): TemplateParam {
    let cls = char.constructor;
    do {
      const template: TemplateParam = this._templates[cls.name];
      if (template !== undefined) {
        return template;
      }
      cls = Object.getPrototypeOf(cls);
    } while (cls.name !== "");
    return this._templates.MathChar;
  }

  protected _render(char: MathChar, params: MathMLNode[]): MathMLNode {
    let template;
    if (
      !this._interactive &&
      (char instanceof Cursor || char instanceof Placeholder)
    ) {
      template = this._templates.MathChar;
    } else {
      template = this._findTemplates(char);
    }
    const node = new MathMLNode(template.tag, template.attrs);
    if (params.length > 0) {
      node.children = params;
    } else {
      node.value = template.value || char.value;
    }
    return node;
  }

  protected _setParenthesesLevel(node: MathMLNode, level: number): MathMLNode {
    const attrs = parenAttrs[Math.min(Math.max(level, 0), 4)];
    node.setAttr(attrs);
    return node;
  }

  protected _addClickableMark(node: MathMLNode, sn: number): MathMLNode {
    const key = Config.getConfig().clickableDataKey;
    if (key) {
      node.setAttr({
        [`data-${key}`]: sn.toString(),
      });
    }
    return node;
  }
}
