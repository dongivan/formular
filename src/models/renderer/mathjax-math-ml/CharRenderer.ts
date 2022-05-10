import Config from "../../Config";
import MathMLNode from "../../MathMLNode";
import { findByClass } from "../../utils";
import { Cursor, MathChar, Placeholder, Variable } from "../../math-char";
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

const greekLetters: Record<string, { value: string; mathvariant?: string }> = {
  "lower-alpha": { value: "&#x3B1;" },
  "upper-alpha": { value: "A" },
  "lower-beta": { value: "&#x3B2;" },
  "upper-beta": { value: "B" },
  "lower-gamma": { value: "&#x3B3;" },
  "upper-gamma": { value: "&#x393;", mathvariant: "normal" },
  "lower-delta": { value: "&#x3B4;" },
  "upper-delta": { value: "&#x394;", mathvariant: "normal" },
  "lower-epsilon": { value: "&#x3F5;" },
  "var-epsilon": { value: "&#x3B5;" },
  "upper-epsilon": { value: "E" },
  "lower-zeta": { value: "&#x3B6;" },
  "upper-zeta": { value: "Z" },
  "lower-eta": { value: "&#x3B7;" },
  "upper-eta": { value: "H" },
  "lower-theta": { value: "&#x3B8;" },
  "var-theta": { value: "&#x3D1;" },
  "upper-theta": { value: "&#x398;", mathvariant: "normal" },
  "lower-iota": { value: "&#x3B9;" },
  "upper-iota": { value: "I" },
  "lower-kappa": { value: "&#x3BA;" },
  "upper-kappa": { value: "K" },
  "lower-lambda": { value: "&#x3BB;" },
  "upper-lambda": { value: "&#x39B;", mathvariant: "normal" },
  "lower-mu": { value: "&#x3BC;" },
  "upper-mu": { value: "M" },
  "lower-nu": { value: "&#x3BD;" },
  "upper-nu": { value: "N" },
  "lower-xi": { value: "&#x3BE;" },
  "upper-xi": { value: "&#x39E;", mathvariant: "normal" },
  "lower-o": { value: "o" },
  "upper-o": { value: "O" },
  "lower-pi": { value: "&#x3C0;" },
  "upper-pi": { value: "&#x3A0;", mathvariant: "normal" },
  "lower-rho": { value: "&#x3C1;" },
  "var-rho": { value: "&#x3F1;" },
  "upper-rho": { value: "P" },
  "lower-sigma": { value: "&#x3C3;" },
  "upper-sigma": { value: "&#x3A3;", mathvariant: "normal" },
  "lower-tau": { value: "&#x3C4;" },
  "upper-tau": { value: "T" },
  "lower-upsilon": { value: "&#x3C5;" },
  "upper-upsilon": { value: "&#x3A5;", mathvariant: "normal" },
  "lower-phi": { value: "&#x3D5;" },
  "var-phi": { value: "&#x3C6;" },
  "upper-phi": { value: "&#x3A6;", mathvariant: "normal" },
  "lower-chi": { value: "&#x3C7;" },
  "upper-chi": { value: "X" },
  "lower-psi": { value: "&#x3C8;" },
  "upper-psi": { value: "&#x3A8;", mathvariant: "normal" },
  "lower-omega": { value: "&#x3C9;" },
  "upper-omega": { value: "&#x3A9;", mathvariant: "normal" },
};

export default class CharRenderer extends BaseRenderer<MathMLNode> {
  protected _templates: Record<string, TemplateParam> = {
    MathChar: { tag: "mtext" },
    Cursor: {
      tag: "mrow",
      value: Config.getConfig().cursorMathML,
      attrs: { class: Config.getConfig().cursorCssClass },
    },
    Placeholder: {
      tag: "mrow",
      value: Config.getConfig().placeholderMathML,
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
    Infinity: { tag: "mi", value: "&#x221E;" },
    Ln: { tag: "mi", value: "ln" },
    Sum: { tag: "mo", value: "&#x2211;" },
  };

  protected _render(char: MathChar, params: MathMLNode[]): MathMLNode {
    let template;
    if (
      !this._interactive &&
      (char instanceof Cursor || char instanceof Placeholder)
    ) {
      template = this._templates.MathChar;
    } else {
      template = findByClass(char, this._templates) || this._templates.MathChar;
    }
    const node = new MathMLNode(template.tag, { attrs: template.attrs });
    if (params.length > 0) {
      node.children = params;
    } else {
      if (char instanceof Variable && char.value in greekLetters) {
        const greekLetter = greekLetters[char.value];
        node.value = greekLetter.value;
        if (greekLetter.mathvariant) {
          node.setAttr({ mathvariant: greekLetter.mathvariant });
        }
      } else {
        node.value = template.value || char.value;
      }
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
