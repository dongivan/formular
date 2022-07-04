type MathMLNodeAttributes = {
  [key: string]: string | undefined;
};

export default class MathMLNode {
  private _pad = 2;
  private _tag: string;
  private _attrs: MathMLNodeAttributes;
  children: (MathMLNode | string)[];

  constructor(
    tag: string,
    attributes?: MathMLNodeAttributes | string | (MathMLNode | string)[],
    children?: string | (MathMLNode | string)[]
  ) {
    this._tag = tag;
    if (typeof attributes == "object" && !Array.isArray(attributes)) {
      this._attrs = attributes;
      this.children = this._initialzeChildren(children);
    } else {
      this._attrs = {};
      this.children = this._initialzeChildren(attributes);
    }
  }

  private _initialzeChildren(
    children: undefined | string | (MathMLNode | string)[]
  ) {
    return Array.isArray(children)
      ? children
      : typeof children == "string"
      ? [children]
      : [];
  }

  /**
   * MathML Node create helper.
   *
   * @param tag tag
   * @param parameters original parameters of constructor, or value (while
   * oftype `string`), or children which should be put in `mrow`s. BE CAREFUL:
   * put `children` into original parameters of constructor if they should
   * not be put in `mrow`s!
   * @returns `MathMLNode` instance
   */
  static create(
    tag: string,
    attributes?: MathMLNodeAttributes | string | (MathMLNode | string)[],
    children?: string | (MathMLNode | string)[]
  ) {
    return new MathMLNode(tag, attributes, children);
  }

  setAttrs(attrs: MathMLNodeAttributes) {
    Object.keys(attrs).forEach((key) => {
      this._attrs[key] = attrs[key];
    });
    return this;
  }

  addClass(clsName: string) {
    this._attrs.class = Array.from(
      new Set(`${this._attrs.class || ""} ${clsName}`.split(" "))
    ).join(" ");
    return this;
  }

  render(level = 0): string {
    const attrs = Object.keys(this._attrs)
      .map<string>((key) =>
        this._attrs[key] === undefined
          ? ` ${key}`
          : ` ${key}="${this._attrs[key]}"`
      )
      .join("");
    const padding = "".padStart(this._pad * level, " "),
      lf = "\n";
    const content = this.children
      .map<string>((ele) =>
        typeof ele == "string"
          ? `${padding}${"".padStart(this._pad, " ")}${ele}`
          : ele.render(level + 1)
      )
      .join(lf);
    const body = content ? `${lf}${content}${lf}${padding}` : "";
    return `${padding}<${this._tag}${attrs}>${body}</${this._tag}>`;
  }
}
