import GenericSymbol from "../GenericSymbol";

export default class Placeholder extends GenericSymbol {
  constructor() {
    super("placeholder");
  }

  renderLatex(): string {
    return "{\\htmlClass{formular-placeholder}{\\ ?\\ }}";
  }
}
