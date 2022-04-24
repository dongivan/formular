import GenericSymbol from "./GenericSymbol";

export default class UnknownSymbol extends GenericSymbol {
  toJSON(): string {
    return this.value + "(?)";
  }
}
