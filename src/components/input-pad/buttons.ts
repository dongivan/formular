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

type Icon = {
  name: string;
  scale?: number;
  flip?: boolean;
};

const iconData: Record<string, Partial<Icon>> = {
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

type InputButton = {
  value: string;
  icon: Icon;
  label?: string;
  name?: string;
  type?: string;
  children?: InputButton[];
};
type ButtonPosition = {
  page: string;
  row: number;
  col: number;
  rowSpan?: number;
  colSpan?: number;
};
type PadButton = InputButton & ButtonPosition;

type ValueParser = (val: string | undefined) => string | undefined;
const runParser = function (
  parser: ValueParser | undefined,
  val: string | undefined,
  defaultValue = true
) {
  return parser ? parser(val) : defaultValue ? val : undefined;
};
const generateIconData = function (iconName: string): Icon {
  return { name: iconName, ...iconData[iconName] };
};
const generateButtons = function (
  names: string[],
  fn: {
    key?: ValueParser;
    value?: ValueParser;
    icon?: ValueParser;
    name?: ValueParser;
  } = {}
) {
  const result: Record<string, InputButton> = {};
  names.forEach((val) => {
    const key = runParser(fn.key, val),
      value = runParser(fn.value, val),
      iconName = runParser(fn.icon, val);
    if (key == undefined || value == undefined || iconName == undefined) {
      return;
    }

    result[key] = {
      value,
      name: runParser(fn.name, val) || val,
      icon: generateIconData(iconName),
    };
  });

  return result;
};

export const inputButtons: Record<string, InputButton> = {
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
};

type PageLayout = (
  | string
  | InputButton
  | (string | InputButton)[]
  | undefined
)[][];

const buttonsLayouts: Record<string, PageLayout> = {
  "page-1": [
    // eslint-disable-next-line prettier/prettier
    ["7",     "8",        "9",       "plus",               "fraction", "english-lower-x",   "left-paren",  "right-paren",          "backspace:1:2:danger" ],
    // eslint-disable-next-line prettier/prettier
    ["4",     "5",        "6",      "minus",      ["square", "power"], "english-lower-k",          "sum",    "factorial",           "undo",        "redo" ],
    // eslint-disable-next-line prettier/prettier
    ["1",     "2",        "3",      "times",            "square-root", "greek-lower-pi",   "i-integral",  "combination",      "move-left",  "move-right" ],
    // eslint-disable-next-line prettier/prettier
    ["point", "0", "infinity",     "divide",                     "ln", "english-lower-e", "differential",        "limit",           "execute:1:2:primary" ],
  ],
};

export const parseLayouts: (
  layouts: Record<string, PageLayout>,
  inputButtons: Record<string, InputButton>
) => Record<string, PadButton[]> = function (layouts) {
  const result: Record<string, PadButton[]> = {};

  Object.keys(layouts).forEach((page) => {
    const layout = layouts[page];
    const buttons: PadButton[] = [];

    layout.forEach((line, row) => {
      line.forEach((btn, col) => {
        if (!btn) {
          return;
        }
        let inputButton: InputButton;
        const buttonPosition: ButtonPosition = {
          page,
          row: row + 1,
          col: col + 1,
        };
        if (typeof btn == "string") {
          const [name, rowSpan, colSpan, type] = btn.split(":");
          inputButton = inputButtons[name];
          inputButton.type = type || inputButton.type || "default";
          buttonPosition.rowSpan = parseInt(rowSpan) || 1;
          buttonPosition.colSpan = parseInt(colSpan) || 1;
        } else if (Array.isArray(btn)) {
          if (btn.length == 0) {
            return;
          }
          const children = btn
            .map<InputButton>((b) =>
              typeof b == "string" ? inputButtons[b] : b
            )
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

    result[page] = buttons;
  });

  return result;
};

const padButtons = parseLayouts(buttonsLayouts, inputButtons);

export { padButtons, PadButton, InputButton };
