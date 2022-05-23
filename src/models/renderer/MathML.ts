import { Config } from "../Config";
import MathMLNode from "../MathMLNode";
import { Renderer } from "./Renderer";

const mathMLGreekLetters: Record<
  string,
  {
    attrs?: {
      [key: string]: string;
    };
    value: string;
  }
> = {
  "lower-alpha": { value: "&#x3B1;" },
  "upper-alpha": { value: "A" },
  "lower-beta": { value: "&#x3B2;" },
  "upper-beta": { value: "B" },
  "lower-gamma": { value: "&#x3B3;" },
  "upper-gamma": { value: "&#x393;", attrs: { mathvariant: "normal" } },
  "lower-delta": { value: "&#x3B4;" },
  "upper-delta": { value: "&#x394;", attrs: { mathvariant: "normal" } },
  "lower-epsilon": { value: "&#x3F5;" },
  "var-epsilon": { value: "&#x3B5;" },
  "upper-epsilon": { value: "E" },
  "lower-zeta": { value: "&#x3B6;" },
  "upper-zeta": { value: "Z" },
  "lower-eta": { value: "&#x3B7;" },
  "upper-eta": { value: "H" },
  "lower-theta": { value: "&#x3B8;" },
  "var-theta": { value: "&#x3D1;" },
  "upper-theta": { value: "&#x398;", attrs: { mathvariant: "normal" } },
  "lower-iota": { value: "&#x3B9;" },
  "upper-iota": { value: "I" },
  "lower-kappa": { value: "&#x3BA;" },
  "upper-kappa": { value: "K" },
  "lower-lambda": { value: "&#x3BB;" },
  "upper-lambda": { value: "&#x39B;", attrs: { mathvariant: "normal" } },
  "lower-mu": { value: "&#x3BC;" },
  "upper-mu": { value: "M" },
  "lower-nu": { value: "&#x3BD;" },
  "upper-nu": { value: "N" },
  "lower-xi": { value: "&#x3BE;" },
  "upper-xi": { value: "&#x39E;", attrs: { mathvariant: "normal" } },
  "lower-o": { value: "o" },
  "upper-o": { value: "O" },
  "lower-pi": { value: "&#x3C0;" },
  "upper-pi": { value: "&#x3A0;", attrs: { mathvariant: "normal" } },
  "lower-rho": { value: "&#x3C1;" },
  "var-rho": { value: "&#x3F1;" },
  "upper-rho": { value: "P" },
  "lower-sigma": { value: "&#x3C3;" },
  "upper-sigma": { value: "&#x3A3;", attrs: { mathvariant: "normal" } },
  "lower-tau": { value: "&#x3C4;" },
  "upper-tau": { value: "T" },
  "lower-upsilon": { value: "&#x3C5;" },
  "upper-upsilon": { value: "&#x3A5;", attrs: { mathvariant: "normal" } },
  "lower-phi": { value: "&#x3D5;" },
  "var-phi": { value: "&#x3C6;" },
  "upper-phi": { value: "&#x3A6;", attrs: { mathvariant: "normal" } },
  "lower-chi": { value: "&#x3C7;" },
  "upper-chi": { value: "X" },
  "lower-psi": { value: "&#x3C8;" },
  "upper-psi": { value: "&#x3A8;", attrs: { mathvariant: "normal" } },
  "lower-omega": { value: "&#x3C9;" },
  "upper-omega": { value: "&#x3A9;", attrs: { mathvariant: "normal" } },
};

export const MathML = new Renderer<MathMLNode[], typeof MathMLNode.create>({
  helper: MathMLNode.create,
  setParenthesesLevelFunction: (eles, level) => {
    const attrs = [
      { stretchy: "false" },
      { stretchy: "true", minsize: "1.2em", maxsize: "1.2em" },
      { stretchy: "true", minsize: "1.623em", maxsize: "1.623em" },
      { stretchy: "true", minsize: "2.047em", maxsize: "2.047em" },
      { stretchy: "true", minsize: "2.470em", maxsize: "2.470em" },
    ][Math.min(Math.max(level, 0), 4)];
    eles[0].setAttr(attrs);
    return eles;
  },
  interactiveFunction: (eles, sn) => {
    const key = Config.getConfig().interactiveDataName;
    if (key && eles.length > 0) {
      eles[0].setAttr({
        [`data-${key}`]: sn.toString(),
      });
    }
    return eles;
  },
  renderEmptyTreeFunction: () => {
    return [];
  },
  afterRenderFunction: (eles, options) => {
    if (!options || eles.length == 0) {
      return eles;
    }
    if (options.active) {
      const clsName = Config.getConfig().activeClass;
      if (clsName) {
        eles[0].addClass(clsName);
      }
    }
    if (options.incomplete) {
      const clsName = Config.getConfig().incompleteClass;
      if (clsName) {
        eles[0].addClass(clsName);
      }
    }
    return eles;
  },
  renderVariable: (char) => {
    return [
      MathMLNode.create(
        "mi",
        mathMLGreekLetters[char.value] || { value: char.value }
      ),
    ];
  },
  renderMathFunction: (char, params) => {
    return [
      MathMLNode.create("mrow", {
        children: [
          MathMLNode.create("mi", char.value),
          MathMLNode.create("mo", "&#x2061;"),
          MathMLNode.create("mrow", {
            children: params[0],
          }),
        ],
      }),
    ];
  },
  renderTextFunction: (children, ...args: unknown[]) => {
    if (children.length == 0) {
      return "";
    }
    const attrs = { display: "" };
    if (args[0]) {
      if (typeof args[0] == "string") {
        attrs.display = args[0];
      } else if (typeof args[0] == "object" && "display" in args[0]) {
        attrs.display = (args[0] as { display: string }).display;
      }
    }
    return new MathMLNode("math", { children, attrs }).render();
  },
});
