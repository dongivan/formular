import Cursor from "./Cursor";

export default class GenericSymbol {
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderLatex(cursor?: Cursor): string {
    return this.value;
  }
}
