type IconType = {
  name: string;
  scale?: number;
  flip?: boolean;
};
type ButtonPosition = {
  row: number;
  column: number;
  rowSpan?: number;
  colSpan?: number;
};
type IconButton = {
  name: string;
  value: string;
  icon: IconType;
  type?: string;
  children?: IconButton[];
};
type PadButton = IconButton & ButtonPosition;

type ControlButton = {
  name: "backspace" | "undo" | "redo" | "move-left" | "move-right" | "execute";
} & PadButton;

type ButtonPage = [PadButton[], PadButton[]?];
type ButtonPages = Record<string, ButtonPage>;
type InputPad = {
  rows: number;
  menu: IconButton[];
  control: {
    columns: number;
    buttons: ControlButton[];
  };
  buttons: {
    columns: number;
    pages: ButtonPages;
  };
};

type Layout = (
  | string
  | (IconButton & Partial<ButtonPosition>)
  | (string | (IconButton & Partial<ButtonPosition>))[]
  | undefined
)[][];
type PageLayout = [Layout, Layout?];

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
  const result: Record<string, IconButton> = {};
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
  layout: Layout,
  repo: Record<string, IconButton>
): PadButton[] {
  const buttons: PadButton[] = [];
  layout.forEach((line, row) => {
    line.forEach((btn, column) => {
      if (!btn) {
        return;
      }
      let inputButton: IconButton;
      const buttonPosition: ButtonPosition = {
        row: row + 1,
        column: column + 1,
      };
      if (typeof btn == "string") {
        const [name, rowSpan, colSpan, type] = btn.split(":");
        inputButton = repo[name];
        if (!inputButton) {
          return;
        }
        inputButton.type = type || inputButton.type || "default";
        buttonPosition.rowSpan = parseInt(rowSpan) || 1;
        buttonPosition.colSpan = parseInt(colSpan) || 1;
      } else if (Array.isArray(btn)) {
        if (btn.length == 0) {
          return;
        }
        const children = btn
          .map<IconButton>((b) => (typeof b == "string" ? repo[b] : b))
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
  pages: Record<string, PageLayout>,
  repo: Record<string, IconButton>
): ButtonPages {
  const result: ButtonPages = {};

  Object.keys(pages).forEach((page) => {
    const pageLayout = pages[page];
    // const buttons: PadButton[] = parseLayout(layout, repo);

    result[page] = pageLayout
      .filter((layout) => layout)
      .map<PadButton[]>((layout) =>
        parseLayout(layout as Layout, repo)
      ) as ButtonPage;
  });

  return result;
}

function generateShiftIcon(name: string): IconButton & Partial<ButtonPosition> {
  return {
    name,
    value: "shift",
    type: "warning",
    icon: generateIcon("control-shift"),
    colSpan: 2,
  };
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
const greekLetterNames = [
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
  "iota",
  "kappa",
  "lambda",
  "mu",
  "nu",
  "xi",
  "o",
  "pi",
  "rho",
  "sigma",
  "tau",
  "upsilon",
  "phi",
  "chi",
  "psi",
  "omega",
];
const varGreek = ["var-epsilon", "var-theta", "var-rho", "var-phi"];
const greek = greekLetterNames
  .map<string[]>((char) => [`upper-${char}`, `lower-${char}`])
  .reduce((prev, cur) => prev.concat(cur))
  .concat(varGreek);
const controls = [
  "move-left",
  "move-right",
  "backspace",
  "undo",
  "redo",
  "execute",
  "shift",
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

const buttonsRepo: Record<string, IconButton> = {
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

const buttonPages: Record<string, PageLayout> = {
  calculator: [
    [
      // eslint-disable-next-line prettier/prettier
      ["7",     "8",        "9",       "plus",               "fraction", "english-lower-x",   "left-paren",  "right-paren",],
      // eslint-disable-next-line prettier/prettier
      ["4",     "5",        "6",      "minus",      ["square", "power"], "english-lower-k",          "sum",    "factorial",],
      // eslint-disable-next-line prettier/prettier
      ["1",     "2",        "3",      "times",            "square-root",  "greek-lower-pi",   "i-integral",  "combination",],
      // eslint-disable-next-line prettier/prettier
      ["point", "0", "infinity",     "divide",                     "ln", "english-lower-e", "differential",        "limit",],
    ],
  ],
  english: ["lower", "upper"].map<Layout>((_case) => {
    const layout = ["abcdefgh", "ijklmnop", "qrstuvwx", "yz"].map<
      (string | (IconButton & Partial<ButtonPosition>))[]
    >((letters) =>
      letters.split("").map<string>((char) => `english-${_case}-${char}`)
    );
    layout[3].push("", "", "", "", generateShiftIcon("english-shift"));
    return layout;
  }) as [Layout, Layout],
  greek: ["lower", "upper"].map<Layout>((_case) => {
    const layout = Array.from({ length: 3 }).map<
      (string | (IconButton & Partial<ButtonPosition>))[]
    >((_, r) =>
      Array.from({ length: 8 }).map<string>(
        (_, i) => `greek-${_case}-${greekLetterNames[i + r * 8]}`
      )
    );
    layout.push([
      ...varGreek.map((letter) => `greek-${letter}`),
      "",
      "",
      generateShiftIcon("greek-shift"),
    ]);
    return layout;
  }) as [Layout, Layout],
};

const controlLayout: Layout = [
  ["backspace:1:2:danger"],
  ["undo", "redo"],
  ["move-left", "move-right"],
  ["execute:1:2:primary"],
];

const inputPad: InputPad = {
  rows: 4,
  menu: [
    {
      name: "calculator",
      value: "calculator",
      type: "primary",
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
      type: "warning",
      icon: generateIcon("menu-about"),
    },
  ],
  control: {
    columns: 2,
    buttons: parseLayout(controlLayout, buttonsRepo) as ControlButton[],
  },
  buttons: {
    columns: 8,
    pages: parsePages(buttonPages, buttonsRepo),
  },
};
export { PadButton as PadButtonType, IconButton as IconButtonType, inputPad };
