export default class MathMLNode {
  private _pad = 2;
  private _tag: string;
  private _attrs: { [key: string]: string | undefined };
  value = "";
  children: MathMLNode[] = [];

  constructor(tag: string, attrs?: { [key: string]: string | undefined }) {
    this._tag = tag;
    this._attrs = attrs || {};
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
    const padding = "".padStart(this._pad * level, " "),
      lf = "\n";
    const content =
      this.children.length > 0
        ? `${lf}${this.children
            .map<string>((ele) => ele.render(level + 1))
            .join(lf)}${lf}${padding}`
        : this.value;
    return `${padding}<${this._tag}${attrs}>${content}</${this._tag}>`;
  }
}
