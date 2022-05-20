import { replace } from "../utils";
import { Renderer } from "./Renderer";

const latexGreekLetters: Record<string, string> = {
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
export const Latex = new Renderer<string, typeof replace>({
  helper: replace,
  setParenthesesLevelFunction: (latex, level) => {
    return (
      (["", "\\big", "\\Big", "\\bigg", "\\Bigg"][
        Math.min(Math.max(level, 0), 4)
      ] || "") + latex
    );
  },
  renderVariable(char) {
    return `{${latexGreekLetters[char.value] || char.value}}`;
  },
  renderTextFunction: (r) => r,
});
