type Icon = {
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
  commands: [string, ...string[]];
  icon: Icon;
  type?: string;
  children?: IconButton[];
};
type PadButton = IconButton & ButtonPosition;

type PageButton = {
  name: string;
  buttons: [IconButton, ...IconButton[]];
};
type ControlButton = PadButton & { commands: [string] };

type ButtonPage = [PadButton[], PadButton[]?];
type ButtonPages = Record<string, ButtonPage>;
type InputPad = {
  rows: number;
  columns: number;
  bottomMenu: (PageButton | IconButton)[];
  leftMenu: (PageButton | IconButton)[];
  controls: ControlButton[];
  pages: ButtonPages;
};

type Layout = (
  | string
  | (IconButton & Partial<ButtonPosition>)
  | (string | (IconButton & Partial<ButtonPosition>))[]
  | undefined
)[][];
type PageLayout = [Layout, Layout?];

type ParseFunction<T> = (val: T | undefined) => T | undefined;

function parse<T>(parser: ParseFunction<T> | undefined, val: T | undefined) {
  return parser ? parser(val) : val;
}

function generateIcon(iconName: string): Icon {
  return {
    name: iconName,
    ...iconData[`${iconName.split("-")[0]}-`],
    ...iconData[iconName],
  };
}

function generateButtons(
  buttonNames: string[],
  parsers: {
    name?: ParseFunction<string>;
    icon?: ParseFunction<string>;
    commands?: ParseFunction<string[]>;
  } = {}
) {
  const result: Record<string, IconButton> = {};
  buttonNames.forEach((btnName) => {
    const name = parse(parsers.name, btnName) || btnName,
      commands = parse<string[]>(parsers.commands, [btnName]),
      iconName = parse(parsers.icon, btnName);
    if (name == undefined || commands == undefined || iconName == undefined) {
      return;
    }

    result[name] = {
      commands: commands as [string, ...string[]],
      name: parse(parsers.name, btnName) || btnName,
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
    commands: ["shift"],
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
  "lg",
  "combination",
  "permutation",
  "factorial",
  "left-paren",
  "right-paren",
  "differential",
];
const functions = [
  "ln",
  "lg",
  "sin",
  "cos",
  "tan",
  "cot",
  "sec",
  "csc",
  "sinh",
  "cosh",
  "arcsin",
  "arccos",
  "arctan",
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
const varGreeks = {
  epsilon: 4,
  theta: 7,
  rho: 16,
  phi: 20,
};
const greek = greekLetterNames
  .map<string[]>((char) => [`upper-${char}`, `lower-${char}`])
  .reduce((prev, cur) => prev.concat(cur))
  .concat(Object.keys(varGreeks).map<string>((l) => `var-${l}`));
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

const iconData: Record<string, Partial<Icon>> = {
  "number-": { scale: 1.3 },
  "english-": { scale: 1.4 },
  "greek-": { scale: 1.4 },
  "operator-fraction": { scale: 2.5 },
  "operator-square": { scale: 1.5 },
  "operator-cube": { scale: 1.5 },
  "operator-power": { scale: 1.5 },
  "operator-square-root": { scale: 2 },
  "operator-cube-root": { scale: 2 },
  "operator-root": { scale: 2 },
  "operator-ln": { scale: 1.35 },
  "operator-sum": { scale: 1.2 },
  "operator-i-integral": { scale: 2 },
  "operator-differential": { scale: 2 },
  "operator-factorial": { scale: 2 },
  "operator-combination": { scale: 2 },
  "operator-limit": { scale: 2 },
  "control-redo": { name: "control-undo", flip: true },
};

const commandsData: Record<string, string[]> = {
  square: ["power", "2", "move-right"],
  cube: ["power", "3", "move-right"],
  "cube-root": ["root", "move-right", "3", "move-left", "move-left"],
};

const buttonsRepo: Record<string, IconButton> = {
  ...generateButtons(numbers, { icon: (val) => `number-${val}` }),
  ...generateButtons(symbols, { icon: (val) => `symbol-${val}` }),
  ...generateButtons(operators, {
    icon: (val) => `operator-${val}`,
    commands: (val) => (val ? commandsData[val[0]] || val : val),
  }),
  ...generateButtons(functions, {
    icon: (val) => `operator-${val}`,
    commands: (val) => (val ? commandsData[val[0]] || [`${val[0]}()`] : val),
  }),
  ...generateButtons(english, {
    name: (val) => `english-lower-${val}`,
    icon: (val) => `english-lower-${val}`,
  }),
  ...generateButtons(english, {
    name: (val) => `english-upper-${val}`,
    commands: (val) => (val ? [val[0].toUpperCase()] : undefined),
    icon: (val) => `english-upper-${val}`,
  }),
  ...generateButtons(greek, {
    name: (val) => `greek-${val}`,
    icon: (val) => `greek-${val}`,
  }),
  ...generateButtons(controls, { icon: (val) => `control-${val}` }),
  ...generateButtons(menu, { icon: (val) => `menu-${val}` }),
  english: {
    name: "english",
    commands: ["english"],
    icon: generateIcon("english-upper-a"),
  },
  greek: {
    name: "greek",
    commands: ["greek"],
    icon: generateIcon("greek-upper-omega"),
  },
};

const buttonPages: Record<string, PageLayout> = {
  calculator: [
    [
      [
        "factorial",
        ["english-lower-x", "english-lower-k"],
        "fraction",
        "7",
        "8",
        "9",
        "plus",
      ],
      [
        "combination",
        "sum",
        ["square", "cube", "power"],
        "4",
        "5",
        "6",
        "minus",
      ],
      [
        "i-integral",
        "greek-lower-pi",
        ["square-root", "cube-root", "root"],
        "1",
        "2",
        "3",
        "times",
      ],
      [
        ["ln", "lg"],
        "english-lower-e",
        "limit",
        ["point", "left-paren"],
        "0",
        ["infinity", "right-paren"],
        ["divide", "fraction"],
      ],
    ],
  ],
  english: ["lower", "upper"].map<Layout>((_case) => {
    const layout = ["abcdefg", "hijklmn", "opqrstu", "vwxyz"].map<
      (string | (IconButton & Partial<ButtonPosition>))[]
    >((letters) =>
      letters.split("").map<string>((char) => `english-${_case}-${char}`)
    );
    layout[3].push(generateShiftIcon("english-shift"));
    return layout;
  }) as [Layout, Layout],
  greek: ["lower", "upper"].map<Layout>((_case) => {
    const layout = Array.from({ length: 4 }).map<
      (string | string[] | (IconButton & Partial<ButtonPosition>))[]
    >((_, r) =>
      Array.from({ length: 7 }).map<string>(
        (_, i) => `greek-${_case}-${greekLetterNames[i + r * 7]}`
      )
    );
    Object.values(varGreeks).forEach((i) => {
      const r = Math.floor(i / 7),
        c = i % 7;
      layout[r][c] = [
        layout[r][c] as string,
        `greek-var-${greekLetterNames[i]}`,
      ];
    });
    layout[3].splice(3, 4, "", "", generateShiftIcon("greek-shift"));
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
  columns: 7,
  bottomMenu: [
    {
      name: "main",
      buttons: [{ ...buttonsRepo["calculator"], type: "primary" }],
    },
    {
      name: "variables",
      buttons: [buttonsRepo["english"], buttonsRepo["greek"]],
    },
    {
      ...(buttonsRepo["undo"] as IconButton),
      children: [buttonsRepo["undo"], buttonsRepo["redo"]],
    },
    buttonsRepo["move-left"] as IconButton,
    buttonsRepo["move-right"] as IconButton,
    {
      ...(buttonsRepo["backspace"] as IconButton),
      type: "danger",
    },
    {
      ...(buttonsRepo["execute"] as IconButton),
      type: "primary",
    },
  ],
  leftMenu: [
    {
      name: "main",
      buttons: [{ ...buttonsRepo["calculator"], type: "primary" }],
    },
    {
      name: "english",
      buttons: [buttonsRepo["english"]],
    },
    {
      name: "greek",
      buttons: [buttonsRepo["greek"]],
    },
    buttonsRepo["about"],
  ],
  controls: parseLayout(controlLayout, buttonsRepo) as ControlButton[],
  pages: parsePages(buttonPages, buttonsRepo),
};

export {
  PadButton as PadButtonType,
  IconButton as IconButtonType,
  PageButton as PageButtonType,
  Icon as IconType,
  inputPad,
};
