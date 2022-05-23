import { replace } from "../utils";
import { Renderer } from "./Renderer";

const latexGreekLetters: Record<string, string> = {
  "upper-alpha": "Α",
  "upper-beta": "Β",
  "upper-gamma": "Γ",
  "upper-delta": "Δ",
  "upper-epsilon": "Ε",
  "upper-zeta": "Ζ",
  "upper-eta": "Η",
  "upper-theta": "Θ",
  "upper-iota": "Ι",
  "upper-kappa": "Κ",
  "upper-lambda": "Λ",
  "upper-mu": "Μ",
  "upper-nu": "Ν",
  "upper-xi": "Ξ",
  "upper-o": "Ο",
  "upper-pi": "Π",
  "upper-rho": "Ρ",
  "upper-sigma": "Σ",
  "upper-tau": "Τ",
  "upper-upsilon": "Υ",
  "upper-phi": "Φ",
  "upper-chi": "Χ",
  "upper-psi": "Ψ",
  "upper-omega": "Ω",
  "lower-alpha": "α",
  "lower-beta": "β",
  "lower-gamma": "γ",
  "lower-delta": "δ",
  "lower-epsilon": "ε",
  "lower-zeta": "ζ",
  "lower-eta": "η",
  "lower-theta": "θ",
  "lower-iota": "ι",
  "lower-kappa": "κ",
  "lower-lambda": "λ",
  "lower-mu": "μ",
  "lower-nu": "ν",
  "lower-xi": "ξ",
  "lower-o": "ο",
  "lower-pi": "π",
  "lower-rho": "ρ",
  "lower-sigma": "σ",
  "lower-tau": "τ",
  "lower-upsilon": "υ",
  "lower-phi": "φ",
  "lower-chi": "χ",
  "lower-psi": "ψ",
  "lower-omega": "ω",
  "var-epsilon": "ε",
  "var-theta": "θ",
  "var-rho": "ρ",
  "var-phi": "φ",
};
export const WolframAlpha = new Renderer<string, typeof replace>({
  helper: replace,
  renderEmptyTreeFunction: () => {
    return "";
  },
  renderVariable(char) {
    return `${latexGreekLetters[char.value] || char.value}`;
  },
  renderMathFunction(char, params) {
    return `${char.value}[${params[0]}]`;
  },
  renderTextFunction: (r) => r,
});
