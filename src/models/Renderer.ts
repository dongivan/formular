import Config from "./Config";
import type { ExpressionTree } from "./expression-tree";
import { AbstractParen, MathChar } from "./math-char";
import { MathSymbol } from "./math-symbol";
import MathMLNode from "./MathMLNode";
import { findByClass, replace } from "./utils";

type AddClickableMarkFunction<N> = (r: N, sn: number) => N;
type SetParenthesesLevelFunction<N> = (r: N, level: number) => N;
type RenderVariableFunction<N> = (char: MathChar) => N;

type DecoratorCharTemplateFunction<N, H> = (args: {
  char: MathChar;
  params: N[];
  h: H;
}) => N;

type DecoratorNodeTemplateFunction<N, H> = (args: {
  current: N;
  left?: N;
  right?: N;
  node: MathSymbol;
  h: H;
  renderChar: (char: MathChar, params: N[]) => N;
}) => N;

class Renderer<N, H> {
  private _helper: H;

  private _charFns: Record<string, DecoratorCharTemplateFunction<N, H>> = {};
  private _addClickableMarkFn?: AddClickableMarkFunction<N>;
  private _setParenthesesLevelFn?: SetParenthesesLevelFunction<N>;
  private _interactive = true;

  private _nodeFns: Record<string, DecoratorNodeTemplateFunction<N, H>> = {};

  readonly renderVariable: RenderVariableFunction<N>;

  constructor(config: {
    helper: H;
    addClickableMarkFunction?: AddClickableMarkFunction<N>;
    setParenthesesLevelFunction?: SetParenthesesLevelFunction<N>;
    renderVariable: RenderVariableFunction<N>;
  }) {
    this._helper = config.helper;
    this._addClickableMarkFn = config.addClickableMarkFunction;
    this._setParenthesesLevelFn = config.setParenthesesLevelFunction;
    this.renderVariable = config.renderVariable;
  }

  /* setters / getters */

  set interactive(flag: boolean) {
    this._interactive = flag;
  }

  /* decorators */

  RenderChar(fn: DecoratorCharTemplateFunction<N, H>) {
    return <T extends typeof MathChar>(constructor: T) => {
      this._charFns[constructor.name] = fn;
    };
  }

  RenderNode(fn: DecoratorNodeTemplateFunction<N, H>) {
    return <T extends typeof MathChar>(constructor: T) => {
      this._nodeFns[constructor.name] = fn;
    };
  }

  /* functions */

  private _renderChar(char: MathChar, params: N[]): N {
    const fn = findByClass(char, this._charFns);
    let result: N;
    if (fn == undefined) {
      throw new Error(
        `Render failed: cannot find char template of \`${char.constructor.name}\`(\`{ ${char.value}}\`).`
      );
    } else {
      result = fn({ char, params, h: this._helper });
    }

    if (this._interactive && this._addClickableMarkFn) {
      result = this._addClickableMarkFn(result, char.sequenceNumber);
    }

    if (this._setParenthesesLevelFn && char instanceof AbstractParen) {
      result = this._setParenthesesLevelFn(result, char.level);
    }

    return result;
  }

  private _renderNode(node: MathSymbol): N {
    const symbol = node;
    const template = findByClass(symbol.char, this._nodeFns);
    if (template == undefined) {
      throw new Error(
        `Render failed: cannot find node template of \`${symbol.char.constructor.name}\`(\`{ ${symbol.char.value}}\`).`
      );
    } else {
      return template({
        node,
        left: node.leftChild ? this._renderNode(node.leftChild) : undefined,
        right: node.rightChild ? this._renderNode(node.rightChild) : undefined,
        current: this._renderChar(
          symbol.char,
          node.paramTrees.map<N>((tree) => this.render(tree))
        ),
        h: this._helper,
        renderChar: this._renderChar.bind(this),
      });
    }
  }

  render(tree: ExpressionTree): N {
    return this._renderNode(tree.root);
  }
}

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
});

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
  addClickableMarkFunction: (eles, sn) => {
    const key = Config.getConfig().clickableDataKey;
    if (key && eles.length > 0) {
      eles[0].setAttr({
        [`data-${key}`]: sn.toString(),
      });
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
});
