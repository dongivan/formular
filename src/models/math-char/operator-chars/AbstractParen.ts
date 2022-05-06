import { MMLParenRenderer } from "../../renderer";
import Operator from "../OperatorChar";

export default abstract class AbstractParen extends Operator {
  readonly mmlRenderer = MMLParenRenderer;
  level = 0;
}
