export default class MMLElement {
  private _pad = 4;
  private _tag: string;
  private _attrs: { [key: string]: string | undefined };
  value = "";
  children: MMLElement[] = [];

  constructor(tag: string, attrs: { [key: string]: string } = {}) {
    this._tag = tag;
    this._attrs = attrs;
  }

  setAttr(attrs: { [key: string]: string | undefined }) {
    Object.keys(attrs).forEach((key) => {
      this._attrs[key] = attrs[key];
    });
    return this;
  }

  render(level = 0): string {
    const attrs = Object.keys(this._attrs)
      .filter((key) => this._attrs[key] !== undefined)
      .map<string>((key) => ` ${key}="${this._attrs[key]}"`)
      .join("");
    const content =
      this.children.length > 0
        ? "\n" +
          this.children.map<string>((ele) => ele.render(level + 1)).join("\n") +
          `\n${"".padStart(this._pad * level, " ")}`
        : this.value;
    return `${"".padStart(this._pad * level, " ")}<${
      this._tag
    }${attrs}>${content}</${this._tag}>`;
  }
}
