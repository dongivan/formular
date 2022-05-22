import { Latex, MathML } from "../../renderer";
import { MathCharFactory, OperandChar } from "../internal";

@MathCharFactory.RegisterMathChar("log")
@Latex.RenderChar(({ params, h }) => h("\\log_{<0>}{<1>}", params))
@MathML.RenderChar(({ params, h }) => [
  h("mrow", {
    children: [
      h("msub", {
        children: [
          h("mi", "log"),
          h("mrow", {
            children: [h("mn", [params[0]])],
          }),
        ],
      }),
      h("mo", "&#x2061;"),
      h("mrow", { children: params[1] }),
    ],
  }),
])
export default class Log extends OperandChar {
  protected _paramsNumber = 2;
  protected _paramsParen = 1 << 1;

  constructor() {
    super("log");
  }
}
