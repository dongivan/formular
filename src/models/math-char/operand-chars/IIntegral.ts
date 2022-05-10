import OperandChar from "../OperandChar";

export default class IIntegral extends OperandChar {
  protected _paramsNumber = 2;

  constructor() {
    super("i-integral");
  }
}
