const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");
const PACKAGES = "base, autoload, require, ams, newcommand";

const root = "../src/assets/icons/";

const number = {};
for (let i = 0; i < 10; i++) {
  number[i] = i.toString();
}

const englishLetters = "abcdefghijklmnopqrstuvwxyz".split("");
const english = {};
for (let i = 0; i < 26; i++) {
  const letter = englishLetters[i];
  english[`upper-${letter}`] = letter.toUpperCase();
  english[`lower-${letter}`] = letter;
}

const greek = {
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

const latexes = {
  math: {
    infinity: "\\infty",
    point: ".",
    plus: "+",
    minus: "-",
    times: "\\times",
    divide: "\\div",
    power: "⬚{\\tiny\\ }^⬚",
    square: "⬚{\\tiny\\ }^2",
    cube: "⬚{\\tiny\\ }^3",
    fraction: "\\frac{⬚\\small\\ }{⬚\\small\\ }",
    "square-root": "\\sqrt{⬚\\ }",
    root: "\\sqrt[⬚]{⬚\\ }",
    "cube-root": "\\sqrt[3]{⬚\\ }",
    /* sum: "\\sum^⬚_{⬚=⬚}", */
    sum: "\\sum",
    prod: "\\prod",
    "i-integral": "\\int",
    "d-integral": "\\int^⬚_⬚",
    exp: "e^⬚",
    "exp-square": "e^2",
    "pi-square-root": "\\sqrt{\\pi}",
    "2pi-square-root": "\\sqrt{2\\pi}",
    /* limit: "\\lim_{⬚\\rightarrow⬚}", */
    limit: "\\lim",
    log: "\\log_⬚",
    ln: "\\ln",
    lg: "\\lg",
    combination: "_⬚C_⬚",
    permutation: "_⬚P_⬚",
    factorial: "⬚{\\small\\ }!",
    "left-paren": "(",
    "right-paren": ")",
    differential: "\\frac{d⬚}{dx}",
    sin: "\\sin",
    cos: "\\cos",
    tan: "\\tan",
    cot: "\\cot",
    sec: "\\sec",
    csc: "\\csc",
    sinh: "\\sinh",
    cosh: "\\cosh",
    arcsin: "^\\text{arc }_\\text{ sin}",
    arccos: "^\\text{arc }_\\text{ cos}",
    arctan: "^\\text{arc }_\\text{ tan}",
  },
  number,
  english,
  greek,
};

const output = async function (MathJax, group, name, latex) {
  const dir = path.join(root, group);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const file = path.join(dir, `${name}.svg`);
  console.log(`working on file ${file}...`);
  /* add `\mathstrut` to latex string to ensure all expressions has the same height */
  const node = await MathJax.tex2svgPromise(`${latex}\\mathstrut`, {
    display: true,
  });
  const result = optimize(MathJax.startup.adaptor.innerHTML(node), {
    plugins: [
      "preset-default",
      {
        name: "removeAttributesBySelector",
        params: {
          selectors: [
            {
              selector: "[data-mml-node]",
              attributes: "data-mml-node",
            },
            {
              selector: "[data-mjx-texclass]",
              attributes: "data-mjx-texclass",
            },
          ],
        },
      },
    ],
  });
  fs.writeFileSync(file, result.data);
  /* fs.writeFileSync(file, MathJax.startup.adaptor.innerHTML(node)); */
};

require("mathjax-full")
  .init({
    options: {
      enableAssistiveMml: false,
    },
    loader: {
      source: {},
      load: ["tex-svg", "adaptors/liteDOM"],
    },
    tex: {
      packages: PACKAGES.split(/\s*,\s*/),
    },
    startup: {
      typeset: false,
    },
    svg: {
      internalSpeechTitles: false,
    },
  })
  .then(async (MathJax) => {
    for (let group in latexes) {
      for (let name in latexes[group]) {
        await output(MathJax, group, name, latexes[group][name]);
      }
    }
  });
