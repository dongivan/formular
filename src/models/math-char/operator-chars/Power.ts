import { Latex, MathML, WolframAlpha } from "../../renderer";
import { MathCharFactory, OperatorChar } from "../internal";

@MathCharFactory.RegisterMathChar("^", "power")
/* use commands intead, see [@/components/input-pad/buttons.ts] */
/*
@MathCharFactory.RegisterCreateFunction("square", (factory, cursor) => {
  const chars = factory.create("power");
  chars.splice(1, 0, ...factory.create("2"));
  if (cursor) {
    chars.push(cursor);
  }
  return chars;
})
@MathCharFactory.RegisterCreateFunction("cube", (factory, cursor) => {
  const chars = factory.create("power");
  chars.splice(1, 0, ...factory.create("3"));
  if (cursor) {
    chars.push(cursor);
  }
  return chars;
})
*/
@Latex.RenderChar(({ params, h }) => h("^{<0>}", params))
@Latex.RenderNode(
  ({ current, left, right }) => `{${left || ""}}${current}${right || ""}`
)
@MathML.RenderChar(({ params, h }) => [h("msup", [h("mrow", params[0])])])
@MathML.RenderNode(({ current, left, h }) => {
  current[0].children.unshift(h("mrow", left ? left : []));
  return current;
})
@WolframAlpha.RenderChar(({ params, h }) => h(`<0>`, params))
@WolframAlpha.RenderNode(
  ({ current, left }) => `Power[${left || ""},${current}]`
)
export default class Power extends OperatorChar {
  constructor() {
    super("^");
    this._priority = OperatorChar.Priorities.Exponentiation;
    this._hasRightOperand = false;
    this._paramsNumber = 1;
  }
}
