import { MathML } from "../renderer";
import MathChar from "./MathChar";

@MathML.RenderChar(({ char, params, h }) => [
  h("mi", params.length > 0 ? params.map((p) => h("mrow", p)) : char.value),
])
export default class OperandChar extends MathChar {}
