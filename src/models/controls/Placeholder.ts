import BaseSymbol from "../BaseSymbol";

export default class Placeholder extends BaseSymbol {
  constructor() {
    super("placeholder");
  }

  renderLatex(): string {
    return "{\\htmlClass{formular-placeholder}{\\ ?\\ }}";
  }
}
