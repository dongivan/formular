import { Cursor, MathChar, Placeholder, Variable } from "../../math-char";
import { findByClass, replace } from "../../utils";
import CharRenderer from "../CharRenderer";

const parenPrefixes = ["", "\\big", "\\Big", "\\bigg", "\\Bigg"];

const greekLetters: Record<string, string> = {
  "lower-alpha": "\\alpha",
  "upper-alpha": "A",
  "lower-beta": "\\beta",
  "upper-beta": "B",
  "lower-gamma": "\\gamma",
  "upper-gamma": "\\Gamma",
  "lower-delta": "\\delta",
  "upper-delta": "\\Delta",
  "lower-epsilon": "\\epsilon",
  "var-epsilon": "\\varepsilon",
  "upper-epsilon": "E",
  "lower-zeta": "\\zeta",
  "upper-zeta": "Z",
  "lower-eta": "\\eta",
  "upper-eta": "H",
  "lower-theta": "\\theta",
  "var-theta": "\\vartheta",
  "upper-theta": "\\Theta",
  "lower-iota": "\\iota",
  "upper-iota": "I",
  "lower-kappa": "\\kappa",
  "upper-kappa": "K",
  "lower-lambda": "\\lambda",
  "upper-lambda": "\\Lambda",
  "lower-mu": "\\mu",
  "upper-mu": "M",
  "lower-nu": "\\nu",
  "upper-nu": "N",
  "lower-xi": "\\xi",
  "upper-xi": "\\Xi",
  "lower-o": "o",
  "upper-o": "O",
  "lower-pi": "\\pi",
  "upper-pi": "\\Pi",
  "lower-rho": "\\rho",
  "var-rho": "\\varrho",
  "upper-rho": "P",
  "lower-sigma": "\\sigma",
  "upper-sigma": "\\Sigma",
  "lower-tau": "\\tau",
  "upper-tau": "T",
  "lower-upsilon": "\\upsilon",
  "upper-upsilon": "\\Upsilon",
  "lower-phi": "\\phi",
  "var-phi": "\\varphi",
  "upper-phi": "\\Phi",
  "lower-chi": "\\chi",
  "upper-chi": "X",
  "lower-psi": "\\psi",
  "upper-psi": "\\Psi",
  "lower-omega": "\\omega",
  "upper-omega": "\\Omega",
};

export default class LatexCharRenderer extends CharRenderer<string> {
  protected _templates: Record<string, string> = {
    MathChar: "<0>",
    Cursor: "⬚",
    Placeholder: "⍰",
    Fraction: "\\frac{<1>}{<2>}",
    SquareRoot: "\\sqrt{<1>}",
    HiddenTimes: "",
    Power: "^{<1>}",
    Divide: "\\div",
    Times: "\\times",
    Infinity: "\\infty",
    Ln: "\\ln<1>",
    Sum: "\\sum^{<3>}_{{<1>}={<2>}}{<4>}",
    IIntegral: "\\int{<1>}d{<2>}",
    Differential: "\\frac{d{<1>}}{d{<2>}}",
    Combination: "{_{<1>}C_{<2>}}",
  };

  protected _render(char: MathChar, params: string[]): string {
    let template;
    if (
      !this._interactive &&
      (char instanceof Cursor || char instanceof Placeholder)
    ) {
      template = "";
    } else {
      template = findByClass(char, this._templates) || "";
    }
    let charValue = char.value;
    if (char instanceof Variable) {
      charValue = `{${greekLetters[charValue] || charValue}}`;
    }
    return replace(template, [charValue, ...params]);
  }

  protected _setParenthesesLevel(latex: string, level: number) {
    return (parenPrefixes[Math.min(Math.max(level, 0), 4)] || "") + latex;
  }
}
