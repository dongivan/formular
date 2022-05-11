import { OperatorChar } from "../internal";

export default abstract class AbstractParen extends OperatorChar {
  level = 0;
}
