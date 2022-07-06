type Icon = {
  name: string;
  scale?: number;
  flip?: boolean;
};
export type Button = {
  name: string;
  value: string;
  icon: Icon;
  children?: Button[];
};
type OptionalButton = Partial<Omit<Button, "icon" | "value">> &
  Pick<Button, "value"> & {
    icon?: Partial<Icon>;
  };
export type MathButton = Button & {
  colspan?: number;
  rowspan?: number;
  type?: "default" | "primary" | "warning" | "danger";
  class?: "shift" | "page" | "key";
  badge?: "auto" | "hide";
};
export type OptionalMathButton = Partial<Omit<MathButton, "icon" | "name">> &
  Pick<MathButton, "name">;

const explode: (value: string) => [string, string] = (value) => {
  const val = value.trim();
  const pos = val.indexOf(":");
  if (pos > -1) {
    return [val.slice(0, pos), val.slice(pos + 1).trim()];
  } else {
    return [val, val];
  }
};
const parseButtons: (
  values: (string | OptionalButton)[],
  prefix: string,
  defaultIcon?: Partial<Icon>
) => Record<string, Readonly<Button>> = (values, prefix, defaultIcon = {}) =>
  Object.freeze(
    values.reduce<Record<string, Button>>((result, val) => {
      if (typeof val == "string") {
        const [name, value] = explode(val);
        result[name] = {
          name,
          value,
          icon: {
            ...defaultIcon,
            name: `${prefix}-${name.toLowerCase()}`,
          },
        };
      } else {
        const name = val.name || val.value;
        result[name] = {
          ...val,
          name,
          icon: {
            ...defaultIcon,
            name: `${prefix}-${name.toLowerCase()}`,
            ...val.icon,
          },
        };
      }
      return result;
    }, {})
  );

export const greeks =
  "alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|o|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega".split(
    "|"
  );
export const varGreeks = "epsilon|theta|rho|phi".split("|");

const maths: (string | OptionalButton)[] = [
  {
    name: "2pi-square-root",
    value: "square-root, 2, lower-pi, move-right",
  },
  "arccos",
  "arcsin",
  "arctan",
  "combination",
  "cos",
  "cosh",
  "cot",
  "csc",
  { name: "cube", value: "power, 3, move-right", icon: { scale: 1.5 } },
  { name: "cube-root", value: "root, move-right, 3, move-left, move-left" },
  { value: "d-integral", icon: { scale: 2.3 } },
  "differential",
  { value: "divide", icon: { scale: 1 } },
  { name: "exp", value: "e, power", icon: { scale: 1.4 } },
  {
    name: "exp-square",
    value: "e, power, 2, move-right",
    icon: { scale: 1.4 },
  },
  { value: "factorial", icon: { scale: 1.6 } },
  { value: "fraction", icon: { scale: 2.5 } },
  "i-integral",
  { value: "infinity", icon: { scale: 1 } },
  { value: "left-paren", icon: { scale: 1 } },
  { value: "lg", icon: { scale: 1.35 } },
  "limit",
  { value: "ln", icon: { scale: 1.35 } },
  { value: "log", icon: { scale: 2.2 } },
  { value: "minus", icon: { scale: 1 } },
  "permutation",
  { name: "pi-square-root", value: "square-root, lower-pi, move-right" },
  { value: "plus", icon: { scale: 1 } },
  { value: "point", icon: { scale: 1 } },
  { value: "power", icon: { scale: 1.5 } },
  { value: "prod", icon: { scale: 1 } },
  { value: "right-paren", icon: { scale: 1 } },
  "root",
  "sec",
  "sin",
  { name: "square", value: "power, 2, move-right", icon: { scale: 1.5 } },
  "square-root",
  { value: "sum", icon: { scale: 1.2 } },
  "sinh",
  "tan",
  { value: "times", icon: { scale: 1 } },
];

const controls = [
  ..."move-left|move-right|backspace|undo|execute|shift|about".split("|"),
  { value: "redo", icon: { name: "control-undo", flip: true } },
];
const menus = [
  "calculator",
  "calculator-2",
  { value: "english-letters", icon: { name: "english-upper-a", scale: 1.4 } },
  { value: "greek-letters", icon: { name: "greek-upper-omega", scale: 1.4 } },
];

const btnRepo = {
  ...parseButtons("0123456789".split(""), "number", { scale: 1.3 }),
  ...parseButtons("abcdefghijklmnopqrstuvwxyz".split(""), "english-lower", {
    scale: 1.4,
  }),
  ...parseButtons("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "english-upper", {
    scale: 1.4,
  }),
  ...parseButtons(
    greeks.map((l) => `lower-${l}`),
    "greek",
    {
      scale: 1.4,
    }
  ),
  ...parseButtons(
    greeks.map((l) => `upper-${l}`),
    "greek",
    {
      scale: 1.4,
    }
  ),
  ...parseButtons(
    varGreeks.map((l) => `var-${l}`),
    "greek",
    {
      scale: 1.4,
    }
  ),
  ...parseButtons(maths, "math", { scale: 2 }),
  ...parseButtons(controls, "control"),
  ...parseButtons(menus, "menu"),
};

export const parseLayout: (
  layout: (
    | undefined
    | string
    | OptionalMathButton
    | string[]
    | [OptionalMathButton, ...string[]]
  )[]
) => (MathButton | undefined)[] = (layout) =>
  layout.map<MathButton | undefined>((item) => {
    if (item == undefined) {
      return undefined;
    } else if (typeof item == "string") {
      return { ...btnRepo[item] };
    } else if (Array.isArray(item)) {
      return typeof item[0] == "string"
        ? {
            ...btnRepo[item[0]],
            children: (item.slice(1) as string[]).map<Button>(
              (child) => btnRepo[child]
            ),
          }
        : {
            ...item[0],
            ...btnRepo[item[0].name || ""],
            children: (item.slice(1) as string[]).map<Button>(
              (child) => btnRepo[child]
            ),
          };
    } else {
      return {
        ...btnRepo[item.name || ""],
        ...item,
      };
    }
  });
