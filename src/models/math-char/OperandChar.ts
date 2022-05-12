import { MathML } from "../Renderer";
import MathChar from "./MathChar";

@MathML.RenderChar(({ char, params, h }) => [
  h("mi", {
    value: char.value,
    children: params.map((p) => h("mrow", { children: p })),
  }),
])
export default class OperandChar extends MathChar {}
