import GenericSymbol from "./GenericSymbol";

export default abstract class Operator extends GenericSymbol {
  static NEED_LEFT = 2;
  static NEED_RIGHT = 1;
  static NEED_BOTH = 3;

  needPlaceholder: number;

  constructor(value: string, needPlaceholder?: number) {
    super(value);
    this.needPlaceholder = needPlaceholder || Operator.NEED_BOTH;
  }

  get needLeft(): boolean {
    return !!(this.needPlaceholder | Operator.NEED_LEFT);
  }

  get needRight(): boolean {
    return !!(this.needPlaceholder | Operator.NEED_RIGHT);
  }
}
