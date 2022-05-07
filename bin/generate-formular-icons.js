const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");
const PACKAGES = "base, autoload, require, ams, newcommand";

const root = "../public/formular-icons";

const numbers = {};
for (let i = 0; i < 10; i++) {
  numbers[i] = i.toString();
}

const englishLetters = "abcdefghijklmnopqrstuvwxyz".split("");
const english = {};
for (let i = 0; i < 26; i++) {
  const letter = englishLetters[i];
  english[`upper-${letter}`] = letter.toUpperCase();
  english[`lower-${letter}`] = letter;
}

const greece = {
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
  operators: {
    Plus: "+",
    Minus: "-",
    Times: "\\times",
    Divide: "\\div",
    Power: "⬚^⬚",
    Square: "⬚^2",
    Cube: "⬚^3",
    Fraction: "\\frac{⬚\\ }{⬚\\ }",
    SquareRoot: "\\sqrt{⬚\\ }",
    Root: "\\sqrt[⬚]{⬚\\ }",
    CubeRoot: "\\sqrt[3]{⬚\\ }",
    /* Sum: "\\sum^⬚_{⬚=⬚}", */
    Sum: "\\sum",
    IIntegral: "\\int",
    DIntegral: "\\int^⬚_⬚",
    ExpPower: "e^⬚",
    ExpSquare: "e^2",
    Infinity: "\\infty",
    /* Limit: "\\lim_{⬚\\rightarrow⬚}", */
    Limit: "\\lim",
    Log: "\\log_⬚",
    Ln: "\\ln",
    Lg: "\\lg",
  },
  numbers,
  english,
  greece,
};

const output = async function (MathJax, group, name, latex) {
  const dir = path.join(root, group);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const file = path.join(dir, `${name}.svg`);
  console.log(`working on file ${file}...`);
  const node = await MathJax.tex2svgPromise(latex, {
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
