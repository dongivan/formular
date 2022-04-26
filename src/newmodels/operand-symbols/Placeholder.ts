import OperandSymbol from "../OperandSymbol";

export default class Placeholder extends OperandSymbol {
  constructor() {
    super("placeholder");
  }

  toLatex(): string {
    return "{\\htmlClass{formular-placeholder}{\\ ?\\ }}";
  }
}
