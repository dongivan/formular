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
const greece = [
  "lower-alpha",
  "upper-alpha",
  "lower-beta",
  "upper-beta",
  "lower-gamma",
  "upper-gamma",
  "lower-delta",
  "upper-delta",
  "lower-epsilon",
  "var-epsilon",
  "upper-epsilon",
  "lower-zeta",
  "upper-zeta",
  "lower-eta",
  "upper-eta",
  "lower-theta",
  "var-theta",
  "upper-theta",
  "lower-iota",
  "upper-iota",
  "lower-kappa",
  "upper-kappa",
  "lower-lambda",
  "upper-lambda",
  "lower-mu",
  "upper-mu",
  "lower-nu",
  "upper-nu",
  "lower-xi",
  "upper-xi",
  "lower-o",
  "upper-o",
  "lower-pi",
  "upper-pi",
  "lower-rho",
  "var-rho",
  "upper-rho",
  "lower-sigma",
  "upper-sigma",
  "lower-tau",
  "upper-tau",
  "lower-upsilon",
  "upper-upsilon",
  "lower-phi",
  "var-phi",
  "upper-phi",
  "lower-chi",
  "upper-chi",
  "lower-psi",
  "upper-psi",
  "lower-omega",
  "upper-omega",
];

const iconSizes: Record<string, string> = {
  "operator-fraction": "2.5em",
  "operator-square": "1.5em",
  "operator-square-root": "2em",
  "operator-ln": "1.35em",
  "operator-sum": "1.2em",
  "operator-i-integral": "2em",
  "operator-differential": "2em",
  "operator-factorial": "2em",
  "operator-combination": "2.4em",
  "operator-limit": "2em",
};

type IconData = {
  icon: string;
  iconSize?: string;
};
type InputButton = {
  value: string;
  label?: string;
  name?: string;
} & Partial<IconData>;
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
const generateIconData = function (
  iconName: string | undefined
): Partial<IconData> {
  if (!iconName) {
    return {};
  }
  const result: IconData = { icon: iconName },
    size = iconSizes[iconName];
  if (size) {
    result.iconSize = size;
  }
  return result;
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
      value = runParser(fn.value, val);
    if (key == undefined || value == undefined) {
      return;
    }

    result[key] = {
      value,
      name: runParser(fn.name, val) || val,
      ...generateIconData(runParser(fn.icon, val)),
      // icon: runParser(fn.icon, val),
      // iconSize: runParser(fn.iconSize, val, false),
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
  ...generateButtons(greece, {
    key: (val) => `greece-${val}`,
    icon: (val) => `greece-${val}`,
  }),
};

console.log(inputButtons);

const buttonsLayouts: Record<string, (string | number)[][]> = {
  "page-1": [
    // eslint-disable-next-line prettier/prettier
    [7,         8,          9,       "plus",    "fraction", "english-lower-x",   "left-paren",  "right-paren"   ],
    // eslint-disable-next-line prettier/prettier
    [4,         5,          6,      "minus",      "square", "english-lower-k",          "sum",    "factorial"   ],
    // eslint-disable-next-line prettier/prettier
    [1,         2,          3,      "times", "square-root", "greece-lower-pi",   "i-integral",  "combination"   ],
    // eslint-disable-next-line prettier/prettier
    ["point",   0, "infinity",     "divide",          "ln", "english-lower-e", "differential",        "limit"   ],
  ],
};

export const parseLayouts: (
  layouts: Record<string, (string | number)[][]>,
  inputButtons: Record<string, InputButton>
) => Record<string, PadButton[]> = function (layouts) {
  const result: Record<string, PadButton[]> = {};

  Object.keys(layouts).forEach((page) => {
    const layout = layouts[page];
    const buttons: PadButton[] = [];

    layout.forEach((line, row) => {
      line.forEach((key, col) => {
        const inputButton = inputButtons[key];
        if (!inputButton) {
          return;
        }

        buttons.push({
          ...inputButton,

          page,
          row: row + 1,
          col: col + 1,
        });
      });
    });

    result[page] = buttons;
  });

  return result;
};

export const padButtons = parseLayouts(buttonsLayouts, inputButtons);
