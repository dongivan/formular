type IconType = {
  name: string;
  scale?: number;
  flip?: boolean;
};
type IconButtonType = {
  name: string;
  value: string;
  icon: IconType;
  type?: string;
  children?: IconButtonType[];
};
type ButtonPositionType = {
  row: number;
  column: number;
  rowSpan?: number;
  colSpan?: number;
};
type PadButtonType = IconButtonType & ButtonPositionType;

type ControlButtonType = {
  name: "backspace" | "undo" | "redo" | "move-left" | "move-right" | "execute";
} & PadButtonType;

type ButtonPagesType = Record<string, PadButtonType[]>;
type InputPadType = {
  rows: number;
  menu: IconButtonType[];
  control: {
    columns: number;
    buttons: ControlButtonType[];
  };
  buttons: {
    columns: number;
    pages: ButtonPagesType;
  };
};

type ButtonLayoutType = (
  | string
  | IconButtonType
  | (string | IconButtonType)[]
  | undefined
)[][];

type ParseFunction = (val: string | undefined) => string | undefined;

function parse(parser: ParseFunction | undefined, val: string | undefined) {
  return parser ? parser(val) : val;
}

function generateIcon(iconName: string): IconType {
  return { name: iconName, ...iconData[iconName] };
}

function generateButtons(
  buttonNames: string[],
  parsers: {
    key?: ParseFunction;
    value?: ParseFunction;
    icon?: ParseFunction;
    name?: ParseFunction;
  } = {}
) {
  const result: Record<string, IconButtonType> = {};
  buttonNames.forEach((val) => {
    const key = parse(parsers.key, val),
      value = parse(parsers.value, val),
      iconName = parse(parsers.icon, val);
    if (key == undefined || value == undefined || iconName == undefined) {
      return;
    }

    result[key] = {
      value,
      name: parse(parsers.name, val) || val,
      icon: generateIcon(iconName),
    };
  });

  return result;
}

function parseLayout(
  layout: ButtonLayoutType,
  repo: Record<string, IconButtonType>
): PadButtonType[] {
  const buttons: PadButtonType[] = [];
  layout.forEach((line, row) => {
    line.forEach((btn, column) => {
      if (!btn) {
        return;
      }
      let inputButton: IconButtonType;
      const buttonPosition: ButtonPositionType = {
        row: row + 1,
        column: column + 1,
      };
      if (typeof btn == "string") {
        const [name, rowSpan, colSpan, type] = btn.split(":");
        inputButton = repo[name];
        inputButton.type = type || inputButton.type || "default";
        buttonPosition.rowSpan = parseInt(rowSpan) || 1;
        buttonPosition.colSpan = parseInt(colSpan) || 1;
      } else if (Array.isArray(btn)) {
        if (btn.length == 0) {
          return;
        }
        const children = btn
          .map<IconButtonType>((b) => (typeof b == "string" ? repo[b] : b))
          .filter((b) => b);
        inputButton = { ...children[0], children };
      } else {
        inputButton = btn;
      }
      if (!inputButton) {
        return;
      }

      buttons.push({
        ...inputButton,
        ...buttonPosition,
      });
    });
  });

  return buttons;
}

function parsePages(
  pages: Record<string, ButtonLayoutType>,
  repo: Record<string, IconButtonType>
): ButtonPagesType {
  const result: ButtonPagesType = {};

  Object.keys(pages).forEach((page) => {
    const layout = pages[page];
    const buttons: PadButtonType[] = parseLayout(layout, repo);

    result[page] = buttons;
  });

  return result;
}

const numbers = "1234567890".split("");
const english = "abcdefghijklmnopqrstuvwxyz".split("");
const symbols = ["point", "infinity"];
const operators = [
  "plus",
  "minus",
  "times",
  "divide",
  "power",
  "square",
  "cube",
  "fraction",
  "square-root",
  "root",
  "cube-root",
  "sum",
  "prod",
  "i-integral",
  "d-integral",
  "exp",
  "exp-square",
  "limit",
  "log",
  "ln",
  "lg",
  "combination",
  "permutation",
  "factorial",
  "left-paren",
  "right-paren",
  "differential",
];
const greek = [
  // eslint-disable-next-line prettier/prettier
  "lower-alpha", "upper-alpha", "lower-beta", "upper-beta", "lower-gamma", "upper-gamma", "lower-delta", "upper-delta", "lower-epsilon", "var-epsilon", "upper-epsilon", "lower-zeta", "upper-zeta", "lower-eta", "upper-eta", "lower-theta", "var-theta", "upper-theta", "lower-iota", "upper-iota", "lower-kappa", "upper-kappa", "lower-lambda", "upper-lambda", "lower-mu", "upper-mu", "lower-nu", "upper-nu", "lower-xi", "upper-xi", "lower-o", "upper-o", "lower-pi", "upper-pi", "lower-rho", "var-rho", "upper-rho", "lower-sigma", "upper-sigma", "lower-tau", "upper-tau", "lower-upsilon", "upper-upsilon", "lower-phi", "var-phi", "upper-phi", "lower-chi", "upper-chi", "lower-psi", "upper-psi", "lower-omega", "upper-omega",
];
const controls = [
  "move-left",
  "move-right",
  "backspace",
  "undo",
  "redo",
  "execute",
];
const menu = ["calculator", "about"];

const iconData: Record<string, Partial<IconType>> = {
  "operator-fraction": { scale: 2.5 },
  "operator-square": { scale: 1.5 },
  "operator-power": { scale: 1.5 },
  "operator-square-root": { scale: 2 },
  "operator-ln": { scale: 1.35 },
  "operator-sum": { scale: 1.2 },
  "operator-i-integral": { scale: 2 },
  "operator-differential": { scale: 2 },
  "operator-factorial": { scale: 2 },
  "operator-combination": { scale: 2.4 },
  "operator-limit": { scale: 2 },
  "control-redo": { name: "control-undo", flip: true },
};

const buttonsRepo: Record<string, IconButtonType> = {
  ...generateButtons(numbers, { icon: (val) => `number-${val}` }),
  ...generateButtons(symbols, { icon: (val) => `symbol-${val}` }),
  ...generateButtons(operators, { icon: (val) => `operator-${val}` }),
  ...generateButtons(english, {
    key: (val) => `english-lower-${val}`,
    icon: (val) => `english-lower-${val}`,
  }),
  ...generateButtons(english, {
    key: (val) => `english-upper-${val}`,
    value: (val) => val?.toUpperCase(),
    icon: (val) => `english-upper-${val}`,
    name: (val) => val?.toUpperCase(),
  }),
  ...generateButtons(greek, {
    key: (val) => `greek-${val}`,
    icon: (val) => `greek-${val}`,
  }),
  ...generateButtons(controls, { icon: (val) => `control-${val}` }),
  ...generateButtons(menu, { icon: (val) => `menu-${val}` }),
};

const buttonPages: Record<string, ButtonLayoutType> = {
  calculator: [
    // eslint-disable-next-line prettier/prettier
    ["7",     "8",        "9",       "plus",               "fraction", "english-lower-x",   "left-paren",  "right-paren",],
    // eslint-disable-next-line prettier/prettier
    ["4",     "5",        "6",      "minus",      ["square", "power"], "english-lower-k",          "sum",    "factorial",],
    // eslint-disable-next-line prettier/prettier
    ["1",     "2",        "3",      "times",            "square-root",  "greek-lower-pi",   "i-integral",  "combination",],
    // eslint-disable-next-line prettier/prettier
    ["point", "0", "infinity",     "divide",                     "ln", "english-lower-e", "differential",        "limit",],
  ],
  english: ["abcdefgh", "ijklmnop", "qrstuvwx", "yz"].map<string[][]>(
    (letters) =>
      letters
        .split("")
        .map<string[]>((char) => [
          `english-lower-${char}`,
          `english-upper-${char}`,
        ])
  ),
};

const controlLayout: ButtonLayoutType = [
  ["backspace:1:2:danger"],
  ["undo", "redo"],
  ["move-left", "move-right"],
  ["execute:1:2:primary"],
];

const inputPad: InputPadType = {
  rows: 4,
  menu: [
    {
      name: "calculator",
      value: "calculator",
      icon: generateIcon("menu-calculator"),
    },
    {
      name: "english",
      value: "english",
      icon: generateIcon("english-upper-a"),
    },
    {
      name: "greek",
      value: "greek",
      icon: generateIcon("greek-upper-omega"),
    },
    {
      name: "about",
      value: "about",
      icon: generateIcon("menu-about"),
    },
  ],
  control: {
    columns: 2,
    buttons: parseLayout(controlLayout, buttonsRepo) as ControlButtonType[],
  },
  buttons: {
    columns: 8,
    pages: parsePages(buttonPages, buttonsRepo),
  },
};
console.log(inputPad);
export { PadButtonType, IconButtonType, inputPad };
